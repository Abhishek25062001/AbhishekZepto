import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ORDER_AUDIT_EVENTS } from '../constants/order-audit-events.constant';
import { ORDER_SLA_STAGES, ORDER_SLA_STATUS } from '../constants/order-sla.constant';
import type { OrderRecord, OrderTimelineEvent } from '../types/order.types';
import { evaluateOrderSla } from './order-sla.service';

const baseDate = new Date('2026-05-21T10:00:00.000Z');

const timelineEvent = (event: string, createdAt: Date): OrderTimelineEvent => ({
  actorId: null,
  actorRole: 'system',
  actorType: 'system',
  createdAt,
  event,
  fromStatus: null,
  reason: null,
  toStatus: null,
});

const buildOrder = (overrides: Partial<OrderRecord> = {}) =>
  ({
    acceptedAt: null,
    orderStatus: 'placed',
    packingStatus: null,
    pickerStatus: null,
    placedAt: baseDate,
    readyForPickupAt: null,
    timeline: [],
    ...overrides,
  }) as Pick<
    OrderRecord,
    | 'acceptedAt'
    | 'orderStatus'
    | 'packingStatus'
    | 'pickerStatus'
    | 'placedAt'
    | 'readyForPickupAt'
    | 'timeline'
  >;

test('evaluateOrderSla marks acceptance at risk before breach threshold', () => {
  const result = evaluateOrderSla(buildOrder(), {
    evaluatedAt: new Date('2026-05-21T10:06:00.000Z'),
  });

  assert.equal(result.stage, ORDER_SLA_STAGES.ACCEPTANCE);
  assert.equal(result.status, ORDER_SLA_STATUS.AT_RISK);
  assert.equal(result.breachedStage, null);
});

test('evaluateOrderSla marks acceptance breached at breach threshold', () => {
  const result = evaluateOrderSla(buildOrder(), {
    evaluatedAt: new Date('2026-05-21T10:10:00.000Z'),
  });

  assert.equal(result.stage, ORDER_SLA_STAGES.ACCEPTANCE);
  assert.equal(result.status, ORDER_SLA_STATUS.BREACHED);
  assert.equal(result.breachedStage, ORDER_SLA_STAGES.ACCEPTANCE);
});

test('evaluateOrderSla evaluates active picking from acceptedAt', () => {
  const result = evaluateOrderSla(
    buildOrder({
      acceptedAt: baseDate,
      orderStatus: 'picking',
      pickerStatus: 'in_progress',
    }),
    { evaluatedAt: new Date('2026-05-21T10:21:00.000Z') },
  );

  assert.equal(result.stage, ORDER_SLA_STAGES.PICKING);
  assert.equal(result.status, ORDER_SLA_STATUS.BREACHED);
});

test('evaluateOrderSla evaluates packing from picking completion event', () => {
  const result = evaluateOrderSla(
    buildOrder({
      acceptedAt: new Date('2026-05-21T09:55:00.000Z'),
      orderStatus: 'packing',
      packingStatus: 'in_progress',
      pickerStatus: 'completed',
      timeline: [
        timelineEvent(ORDER_AUDIT_EVENTS.PICKING_COMPLETED, baseDate),
        timelineEvent(ORDER_AUDIT_EVENTS.PACKING_STARTED, new Date('2026-05-21T10:01:00.000Z')),
      ],
    }),
    { evaluatedAt: new Date('2026-05-21T10:11:00.000Z') },
  );

  assert.equal(result.stage, ORDER_SLA_STAGES.PACKING);
  assert.equal(result.status, ORDER_SLA_STATUS.BREACHED);
});

test('evaluateOrderSla evaluates ready-for-pickup from packing completion event', () => {
  const result = evaluateOrderSla(
    buildOrder({
      orderStatus: 'packing',
      packingStatus: 'completed',
      pickerStatus: 'completed',
      timeline: [
        timelineEvent(ORDER_AUDIT_EVENTS.PACKING_COMPLETED, baseDate),
      ],
    }),
    { evaluatedAt: new Date('2026-05-21T10:11:00.000Z') },
  );

  assert.equal(result.stage, ORDER_SLA_STAGES.READY_FOR_PICKUP);
  assert.equal(result.status, ORDER_SLA_STATUS.BREACHED);
});

test('evaluateOrderSla skips cancelled orders', () => {
  const result = evaluateOrderSla(
    buildOrder({
      orderStatus: 'cancelled',
    }),
    { evaluatedAt: new Date('2026-05-21T10:30:00.000Z') },
  );

  assert.equal(result.stage, null);
  assert.equal(result.status, ORDER_SLA_STATUS.NOT_APPLICABLE);
});
