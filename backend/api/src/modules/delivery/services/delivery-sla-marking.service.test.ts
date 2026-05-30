/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import {
  DELIVERY_SLA_BREACH_EVENT,
  DELIVERY_SLA_STAGES,
  DELIVERY_SLA_STATUS,
} from '../constants/delivery-sla.constant';
import * as auditModule from '../../audit/services/audit-log.service';
import * as deliveryRepositoryModule from '../repositories/delivery-assignment.repository';
import type { CreateAuditLogInput } from '../../audit/types/audit-log.types';
import type { IDeliveryAssignmentDocument, IDeliveryTimelineEvent } from '../types/delivery-assignment.types';
import { markDelayedDeliveriesForSla } from './delivery-sla-marking.service';
import * as notificationModule from './delivery-notification.service';

const originalPublish = notificationModule.publishDeliveryNotificationPlaceholders;

const deliveryRepository = deliveryRepositoryModule as unknown as {
  listDeliveriesForSlaEvaluation: typeof deliveryRepositoryModule.listDeliveriesForSlaEvaluation;
  updateDeliverySlaById: typeof deliveryRepositoryModule.updateDeliverySlaById;
};

const auditLogService = auditModule as unknown as {
  writeAuditLog: typeof auditModule.writeAuditLog;
};

const buildDelivery = (overrides: Partial<IDeliveryAssignmentDocument> = {}): IDeliveryAssignmentDocument => ({
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

afterEach(() => {
  deliveryRepository.listDeliveriesForSlaEvaluation = deliveryRepositoryModule.listDeliveriesForSlaEvaluation;
  deliveryRepository.updateDeliverySlaById = deliveryRepositoryModule.updateDeliverySlaById;
  auditLogService.writeAuditLog = auditModule.writeAuditLog;
  (notificationModule as any).publishDeliveryNotificationPlaceholders = originalPublish;
});

test('markDelayedDeliveriesForSla marks a newly breached delivery once', async () => {
  const delivery = buildDelivery();
  const capturedUpdates: Array<{
    deliveryId: string;
    payload: {
      slaStatus: string;
      slaBreachedStage: string | null;
      slaBreachedAt: Date | null;
    };
    timelineEvent?: IDeliveryTimelineEvent;
  }> = [];
  const capturedAuditLogs: CreateAuditLogInput[] = [];

  deliveryRepository.listDeliveriesForSlaEvaluation = async () => [delivery];
  auditLogService.writeAuditLog = async (input) => {
    capturedAuditLogs.push(input);
  };
  deliveryRepository.updateDeliverySlaById = async (deliveryId, payload, timelineEvent) => {
    capturedUpdates.push({ deliveryId: deliveryId.toString(), payload, timelineEvent });
    return {
      ...delivery,
      ...payload,
      timeline: timelineEvent ? [...delivery.timeline, timelineEvent] : delivery.timeline,
    } as unknown as IDeliveryAssignmentDocument;
  };

  let notificationCalledWith: { deliveryId: string; eventType: string } | null = null;
  (notificationModule as any).publishDeliveryNotificationPlaceholders = async (delivery: any, eventType: string) => {
    notificationCalledWith = { deliveryId: delivery._id.toString(), eventType };
  };

  let result;
  try {
    result = await markDelayedDeliveriesForSla({
      evaluatedAt: new Date('2026-05-29T10:06:00.000Z'), // 6 mins since createdAt, breach is 5 mins
    });
  } finally {
    (notificationModule as any).publishDeliveryNotificationPlaceholders = originalPublish;
  }

  assert.equal(result.evaluatedCount, 1);
  assert.equal(result.breachedCount, 1);
  assert.equal(result.skippedCount, 0);

  const [capturedUpdate] = capturedUpdates;
  assert.ok(capturedUpdate);
  assert.equal(capturedUpdate.deliveryId, delivery._id.toString());
  assert.equal(capturedUpdate.payload.slaStatus, DELIVERY_SLA_STATUS.BREACHED);
  assert.equal(capturedUpdate.payload.slaBreachedStage, DELIVERY_SLA_STAGES.ASSIGNMENT);
  assert.equal(capturedUpdate.timelineEvent?.actorType, 'system');
  assert.equal(capturedUpdate.timelineEvent?.reason, `delivery.sla.breached:${DELIVERY_SLA_STAGES.ASSIGNMENT}`);

  const [capturedAuditLog] = capturedAuditLogs;
  assert.ok(capturedAuditLog);
  assert.equal(capturedAuditLog.eventType, DELIVERY_SLA_BREACH_EVENT);
  assert.equal(capturedAuditLog.actorSurface, 'backend');
  assert.equal(capturedAuditLog.actorRole, 'system');
  assert.equal(capturedAuditLog.entityId?.toString(), delivery._id.toString());
  assert.equal(capturedAuditLog.metadata.slaBreachedStage, DELIVERY_SLA_STAGES.ASSIGNMENT);

  assert.ok(notificationCalledWith);
  assert.equal((notificationCalledWith as any).eventType, 'sla_breached');
  assert.equal((notificationCalledWith as any).deliveryId, delivery._id.toString());
});

test('markDelayedDeliveriesForSla skips deliveries already breached for the same stage', async () => {
  let updateCalled = false;

  deliveryRepository.listDeliveriesForSlaEvaluation = async () => [
    buildDelivery({
      slaBreachedStage: DELIVERY_SLA_STAGES.ASSIGNMENT,
      slaStatus: DELIVERY_SLA_STATUS.BREACHED,
    }),
  ];
  deliveryRepository.updateDeliverySlaById = async () => {
    updateCalled = true;
    return null;
  };

  const result = await markDelayedDeliveriesForSla({
    evaluatedAt: new Date('2026-05-29T10:06:00.000Z'),
  });

  assert.equal(result.evaluatedCount, 1);
  assert.equal(result.breachedCount, 0);
  assert.equal(result.skippedCount, 1);
  assert.equal(updateCalled, false);
});

test('markDelayedDeliveriesForSla skips non-breached deliveries', async () => {
  let updateCalled = false;

  deliveryRepository.listDeliveriesForSlaEvaluation = async () => [buildDelivery()];
  deliveryRepository.updateDeliverySlaById = async () => {
    updateCalled = true;
    return null;
  };

  const result = await markDelayedDeliveriesForSla({
    evaluatedAt: new Date('2026-05-29T10:03:00.000Z'), // 3 mins since creation, not breached
  });

  assert.equal(result.evaluatedCount, 1);
  assert.equal(result.breachedCount, 0);
  assert.equal(result.skippedCount, 1);
  assert.equal(updateCalled, false);
});
