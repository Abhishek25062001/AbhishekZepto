import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import { ORDER_AUDIT_EVENTS } from '../constants/order-audit-events.constant';
import { ORDER_SLA_STAGES, ORDER_SLA_STATUS } from '../constants/order-sla.constant';
import * as auditModule from '../../audit/services/audit-log.service';
import * as orderRepositoryModule from '../repositories/order.repository';
import type { CreateAuditLogInput } from '../../audit/types/audit-log.types';
import type { OrderRecord, OrderTimelineEvent } from '../types/order.types';
import { markDelayedOrdersForSla } from './order-sla-marking.service';

const orderRepository = orderRepositoryModule as unknown as {
  listOrdersForSlaEvaluation: typeof orderRepositoryModule.listOrdersForSlaEvaluation;
  updateOrderSlaById: typeof orderRepositoryModule.updateOrderSlaById;
};

const auditLogService = auditModule as unknown as {
  writeAuditLog: typeof auditModule.writeAuditLog;
};

const buildOrder = (overrides: Partial<OrderRecord> = {}): OrderRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(),
  acceptedAt: null,
  addressSnapshot: {
    city: 'City',
    country: 'IN',
    label: 'Home',
    landmark: null,
    latitude: 0,
    line1: 'Line 1',
    line2: null,
    longitude: 0,
    postalCode: null,
    state: null,
  },
  assignedPickerId: null,
  cancellationReason: null,
  cancelledAt: null,
  cancelledBy: null,
  cartId: new Types.ObjectId(),
  checkoutSessionId: new Types.ObjectId(),
  createdAt: new Date('2026-05-21T09:59:00.000Z'),
  currency: 'INR',
  customerId: new Types.ObjectId(),
  deliveryFeeAmount: 0,
  discountAmount: 0,
  grandTotal: 100,
  inventoryConfirmed: true,
  items: [],
  orderNumber: 'ORD-SLA',
  orderStatus: 'placed',
  packingStatus: null,
  paymentId: new Types.ObjectId(),
  paymentStatus: 'paid',
  pickerStatus: null,
  placedAt: new Date('2026-05-21T10:00:00.000Z'),
  readyForPickupAt: null,
  refundReviewRequired: false,
  rejectedAt: null,
  rejectionReason: null,
  slaBreachedStage: null,
  slaStatus: ORDER_SLA_STATUS.ON_TRACK,
  storeId: new Types.ObjectId(),
  storeStatus: 'pending_acceptance',
  subtotal: 100,
  taxAmount: 0,
  timeline: [],
  updatedAt: new Date('2026-05-21T09:59:00.000Z'),
  ...overrides,
});

afterEach(() => {
  orderRepository.listOrdersForSlaEvaluation = orderRepositoryModule.listOrdersForSlaEvaluation;
  orderRepository.updateOrderSlaById = orderRepositoryModule.updateOrderSlaById;
  auditLogService.writeAuditLog = auditModule.writeAuditLog;
});

test('markDelayedOrdersForSla marks a newly breached order once', async () => {
  const order = buildOrder();
  const capturedUpdates: Array<{
    orderId: string;
    payload: Pick<OrderRecord, 'slaBreachedStage' | 'slaStatus'>;
    timelineEvent?: OrderTimelineEvent;
  }> = [];
  const capturedAuditLogs: CreateAuditLogInput[] = [];

  orderRepository.listOrdersForSlaEvaluation = async () => [order];
  auditLogService.writeAuditLog = async (input) => {
    capturedAuditLogs.push(input);
  };
  orderRepository.updateOrderSlaById = async (orderId, payload, timelineEvent) => {
    capturedUpdates.push({ orderId, payload, timelineEvent });
    return {
      ...order,
      ...payload,
      timeline: timelineEvent ? [...order.timeline, timelineEvent] : order.timeline,
    };
  };

  const result = await markDelayedOrdersForSla({
    evaluatedAt: new Date('2026-05-21T10:11:00.000Z'),
  });

  assert.equal(result.evaluatedCount, 1);
  assert.equal(result.breachedCount, 1);
  assert.equal(result.skippedCount, 0);
  const [capturedUpdate] = capturedUpdates;
  assert.ok(capturedUpdate);
  assert.equal(capturedUpdate?.orderId, order._id.toString());
  assert.equal(capturedUpdate?.payload.slaStatus, ORDER_SLA_STATUS.BREACHED);
  assert.equal(capturedUpdate?.payload.slaBreachedStage, ORDER_SLA_STAGES.ACCEPTANCE);
  assert.equal(capturedUpdate?.timelineEvent?.event, ORDER_AUDIT_EVENTS.SLA_BREACHED);
  assert.equal(capturedUpdate?.timelineEvent?.actorType, 'system');
  const [capturedAuditLog] = capturedAuditLogs;
  assert.ok(capturedAuditLog);
  assert.equal(capturedAuditLog.eventType, ORDER_AUDIT_EVENTS.SLA_BREACHED);
  assert.equal(capturedAuditLog.actorSurface, 'backend');
  assert.equal(capturedAuditLog.actorRole, 'system');
  assert.equal(capturedAuditLog.entityId?.toString(), order._id.toString());
  assert.equal(capturedAuditLog.metadata.slaBreachedStage, ORDER_SLA_STAGES.ACCEPTANCE);
});

test('markDelayedOrdersForSla skips orders already breached for the same stage', async () => {
  let updateCalled = false;

  orderRepository.listOrdersForSlaEvaluation = async () => [
    buildOrder({
      slaBreachedStage: ORDER_SLA_STAGES.ACCEPTANCE,
      slaStatus: ORDER_SLA_STATUS.BREACHED,
    }),
  ];
  orderRepository.updateOrderSlaById = async () => {
    updateCalled = true;
    return null;
  };

  const result = await markDelayedOrdersForSla({
    evaluatedAt: new Date('2026-05-21T10:11:00.000Z'),
  });

  assert.equal(result.evaluatedCount, 1);
  assert.equal(result.breachedCount, 0);
  assert.equal(result.skippedCount, 1);
  assert.equal(updateCalled, false);
});

test('markDelayedOrdersForSla skips non-breached orders', async () => {
  let updateCalled = false;

  orderRepository.listOrdersForSlaEvaluation = async () => [buildOrder()];
  orderRepository.updateOrderSlaById = async () => {
    updateCalled = true;
    return null;
  };

  const result = await markDelayedOrdersForSla({
    evaluatedAt: new Date('2026-05-21T10:03:00.000Z'),
  });

  assert.equal(result.evaluatedCount, 1);
  assert.equal(result.breachedCount, 0);
  assert.equal(result.skippedCount, 1);
  assert.equal(updateCalled, false);
});
