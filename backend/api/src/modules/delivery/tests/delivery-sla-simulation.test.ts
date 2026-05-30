/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import {
  DELIVERY_SLA_BREACH_EVENT,
  DELIVERY_SLA_STAGES,
  DELIVERY_SLA_STATUS,
} from '../constants/delivery-sla.constant';
import * as auditModule from '../../audit/services/audit-log.service';
import * as repositoryModule from '../repositories/delivery-assignment.repository';
import * as notificationModule from '../services/delivery-notification.service';
import { markDelayedDeliveriesForSla } from '../services/delivery-sla-marking.service';
import { evaluateDeliverySla } from '../services/delivery-sla.service';
import type { IDeliveryAssignmentDocument } from '../types/delivery-assignment.types';

// Fixture helpers
const buildDeliveryMock = (overrides: Partial<IDeliveryAssignmentDocument> = {}): IDeliveryAssignmentDocument => ({
  _id: new Types.ObjectId(),
  orderId: new Types.ObjectId(),
  customerId: new Types.ObjectId(),
  storeId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  deliveryAgentId: null,
  deliveryStatus: 'pending_assignment',
  assignedAt: null,
  arrivedAtStoreAt: null,
  pickedUpAt: null,
  enRouteToCustomerAt: null,
  arrivedAtCustomerAt: null,
  completedAt: null,
  deliveredAt: null,
  failedAt: null,
  failureReason: null,
  cancelledAt: null,
  cancellationReason: null,
  timeline: [],
  slaStatus: 'not_started',
  slaBreachedStage: null,
  slaAssignmentDeadline: null,
  slaPickupDeadline: null,
  slaDropDeadline: null,
  slaTotalDeadline: null,
  slaBreachedAt: null,
  createdAt: new Date('2026-05-29T10:00:00.000Z'),
  updatedAt: new Date('2026-05-29T10:00:00.000Z'),
  ...overrides,
} as unknown as IDeliveryAssignmentDocument);

test('SLA Timeline Simulation Test - evaluates all stage breaches sequentially', async () => {
  // Save originals to restore
  const originalList = repositoryModule.listDeliveriesForSlaEvaluation;
  const originalUpdate = repositoryModule.updateDeliverySlaById;
  const originalAudit = auditModule.writeAuditLog;
  const originalPublish = notificationModule.publishDeliveryNotificationPlaceholders;

  const repo = repositoryModule as any;
  const audit = auditModule as any;
  const notifications = notificationModule as any;

  // Stored state representing mock DB and external integrations
  const mockDeliveries: IDeliveryAssignmentDocument[] = [];
  const capturedUpdates: Array<{
    deliveryId: string;
    payload: any;
    timelineEvent: any;
  }> = [];
  const capturedAuditLogs: any[] = [];
  const capturedNotifications: Array<{ deliveryId: string; eventType: string }> = [];

  try {
    // 1. Setup in-memory stubs
    repo.listDeliveriesForSlaEvaluation = async () => {
      return mockDeliveries;
    };

    repo.updateDeliverySlaById = async (id: string, payload: any, timelineEvent: any) => {
      const idx = mockDeliveries.findIndex(d => d._id.toString() === id);
      if (idx !== -1) {
        const current = mockDeliveries[idx];
        if (current) {
          const updated = {
            ...current,
            ...payload,
            timeline: timelineEvent ? [...current.timeline, timelineEvent] : current.timeline,
          };
          mockDeliveries[idx] = updated;
          capturedUpdates.push({ deliveryId: id, payload, timelineEvent });
          return updated;
        }
      }
      return null;
    };

    audit.writeAuditLog = async (logInput: any) => {
      capturedAuditLogs.push(logInput);
    };

    notifications.publishDeliveryNotificationPlaceholders = async (delivery: any, eventType: string) => {
      capturedNotifications.push({ deliveryId: delivery._id.toString(), eventType });
    };

    // 2. Unit tests evaluating active SLA stage calculations directly via evaluateDeliverySla
    const baseDelivery = buildDeliveryMock({ createdAt: new Date('2026-05-29T10:00:00.000Z') });
    
    // Test direct evaluation at various phases
    // Assignment SLA (breach at 5 minutes)
    const assignBreached = evaluateDeliverySla(baseDelivery, { evaluatedAt: new Date('2026-05-29T10:06:00.000Z') });
    assert.equal(assignBreached.status, DELIVERY_SLA_STATUS.BREACHED);
    assert.equal(assignBreached.breachedStage, DELIVERY_SLA_STAGES.ASSIGNMENT);

    // Pickup SLA (breach at 15 minutes since assignedAt)
    const pickupDelivery = buildDeliveryMock({
      deliveryStatus: 'assigned',
      createdAt: new Date('2026-05-29T10:00:00.000Z'),
      assignedAt: new Date('2026-05-29T10:02:00.000Z'),
    });
    const pickupBreached = evaluateDeliverySla(pickupDelivery, { evaluatedAt: new Date('2026-05-29T10:18:00.000Z') });
    assert.equal(pickupBreached.status, DELIVERY_SLA_STATUS.BREACHED);
    assert.equal(pickupBreached.breachedStage, DELIVERY_SLA_STAGES.PICKUP);

    // Drop SLA (breach at 30 minutes since pickedUpAt)
    const dropDelivery = buildDeliveryMock({
      deliveryStatus: 'picked_up',
      createdAt: new Date('2026-05-29T10:00:00.000Z'),
      assignedAt: new Date('2026-05-29T10:02:00.000Z'),
      pickedUpAt: new Date('2026-05-29T10:12:00.000Z'),
    });
    const dropBreached = evaluateDeliverySla(dropDelivery, { evaluatedAt: new Date('2026-05-29T10:43:00.000Z') });
    assert.equal(dropBreached.status, DELIVERY_SLA_STATUS.BREACHED);
    assert.equal(dropBreached.breachedStage, DELIVERY_SLA_STAGES.DROP);

    // 3. Sequential Simulation of Delays

    // --- Scenario A: Assignment SLA Delay ---
    // Simulate a 6-minute window since createdAt (pending assignment status)
    const dAssignmentDelay = buildDeliveryMock({
      _id: new Types.ObjectId(),
      deliveryStatus: 'pending_assignment',
      createdAt: new Date('2026-05-29T10:00:00.000Z'),
      timeline: [],
    });
    mockDeliveries.push(dAssignmentDelay);

    const resAssignment = await markDelayedDeliveriesForSla({
      evaluatedAt: new Date('2026-05-29T10:06:00.000Z'),
    });
    assert.equal(resAssignment.breachedCount, 1);
    
    // Check that DB, Timeline, Audit and Notifications are updated
    const assignmentDoc = mockDeliveries.find(d => d._id.toString() === dAssignmentDelay._id.toString())!;
    assert.equal(assignmentDoc.slaStatus, DELIVERY_SLA_STATUS.BREACHED);
    assert.equal(assignmentDoc.slaBreachedStage, DELIVERY_SLA_STAGES.ASSIGNMENT);
    assert.ok(assignmentDoc.timeline.some(e => e.reason === `delivery.sla.breached:${DELIVERY_SLA_STAGES.ASSIGNMENT}`));

    const auditAssignment = capturedAuditLogs.find(l => l.entityId.toString() === dAssignmentDelay._id.toString());
    assert.ok(auditAssignment);
    assert.equal(auditAssignment.eventType, DELIVERY_SLA_BREACH_EVENT);
    assert.equal(auditAssignment.metadata.slaBreachedStage, DELIVERY_SLA_STAGES.ASSIGNMENT);

    assert.ok(capturedNotifications.some(n => n.deliveryId === dAssignmentDelay._id.toString() && n.eventType === 'sla_breached'));

    // Clear db for next scenario
    mockDeliveries.length = 0;

    // --- Scenario B: Pickup SLA Delay ---
    // Simulate a 16-minute window since assignedAt (with en_route_to_store status)
    const dPickupDelay = buildDeliveryMock({
      _id: new Types.ObjectId(),
      deliveryStatus: 'en_route_to_store',
      createdAt: new Date('2026-05-29T10:00:00.000Z'),
      assignedAt: new Date('2026-05-29T10:02:00.000Z'),
      timeline: [],
    });
    mockDeliveries.push(dPickupDelay);

    const resPickup = await markDelayedDeliveriesForSla({
      evaluatedAt: new Date('2026-05-29T10:19:00.000Z'), // 17 mins since assignedAt (threshold: 15 mins)
    });
    assert.equal(resPickup.breachedCount, 1);

    const pickupDoc = mockDeliveries.find(d => d._id.toString() === dPickupDelay._id.toString())!;
    assert.equal(pickupDoc.slaStatus, DELIVERY_SLA_STATUS.BREACHED);
    assert.equal(pickupDoc.slaBreachedStage, DELIVERY_SLA_STAGES.PICKUP);
    assert.ok(pickupDoc.timeline.some(e => e.reason === `delivery.sla.breached:${DELIVERY_SLA_STAGES.PICKUP}`));

    const auditPickup = capturedAuditLogs.find(l => l.entityId.toString() === dPickupDelay._id.toString());
    assert.ok(auditPickup);
    assert.equal(auditPickup.eventType, DELIVERY_SLA_BREACH_EVENT);
    assert.equal(auditPickup.metadata.slaBreachedStage, DELIVERY_SLA_STAGES.PICKUP);

    assert.ok(capturedNotifications.some(n => n.deliveryId === dPickupDelay._id.toString() && n.eventType === 'sla_breached'));

    // Clear db for next scenario
    mockDeliveries.length = 0;

    // --- Scenario C: Drop SLA Delay ---
    // Simulate a 31-minute window since pickedUpAt (with en_route_to_customer status, threshold is 30 mins)
    const dDropDelay = buildDeliveryMock({
      _id: new Types.ObjectId(),
      deliveryStatus: 'en_route_to_customer',
      createdAt: new Date('2026-05-29T10:00:00.000Z'),
      assignedAt: new Date('2026-05-29T10:02:00.000Z'),
      pickedUpAt: new Date('2026-05-29T10:12:00.000Z'),
      timeline: [],
    });
    mockDeliveries.push(dDropDelay);

    const resDrop = await markDelayedDeliveriesForSla({
      evaluatedAt: new Date('2026-05-29T10:43:00.000Z'), // 31 mins since pickedUpAt (threshold: 30 mins)
    });
    assert.equal(resDrop.breachedCount, 1);

    const dropDoc = mockDeliveries.find(d => d._id.toString() === dDropDelay._id.toString())!;
    assert.equal(dropDoc.slaStatus, DELIVERY_SLA_STATUS.BREACHED);
    assert.equal(dropDoc.slaBreachedStage, DELIVERY_SLA_STAGES.DROP);
    assert.ok(dropDoc.timeline.some(e => e.reason === `delivery.sla.breached:${DELIVERY_SLA_STAGES.DROP}`));

    const auditDrop = capturedAuditLogs.find(l => l.entityId.toString() === dDropDelay._id.toString());
    assert.ok(auditDrop);
    assert.equal(auditDrop.eventType, DELIVERY_SLA_BREACH_EVENT);
    assert.equal(auditDrop.metadata.slaBreachedStage, DELIVERY_SLA_STAGES.DROP);

    assert.ok(capturedNotifications.some(n => n.deliveryId === dDropDelay._id.toString() && n.eventType === 'sla_breached'));

  } finally {
    // Restore all mocked functions
    repo.listDeliveriesForSlaEvaluation = originalList;
    repo.updateDeliverySlaById = originalUpdate;
    audit.writeAuditLog = originalAudit;
    notifications.publishDeliveryNotificationPlaceholders = originalPublish;
  }
});
