import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DELIVERY_SLA_STAGES,
  DELIVERY_SLA_STATUS,
} from '../constants/delivery-sla.constant';
import type { IDeliveryAssignmentBase } from '../types/delivery-assignment.types';
import { evaluateDeliverySla } from './delivery-sla.service';

const baseDate = new Date('2026-05-29T10:00:00.000Z');

const buildDelivery = (overrides: Partial<IDeliveryAssignmentBase> = {}) =>
  ({
    deliveryStatus: 'pending_assignment',
    createdAt: baseDate,
    assignedAt: null,
    pickedUpAt: null,
    deliveredAt: null,
    slaStatus: 'not_started',
    ...overrides,
  }) as Pick<
    IDeliveryAssignmentBase,
    'deliveryStatus' | 'createdAt' | 'assignedAt' | 'pickedUpAt' | 'deliveredAt' | 'slaStatus'
  >;

test('evaluateDeliverySla handles pending_assignment (Assignment SLA)', () => {
  // On time (e.g. 2 minutes)
  const onTimeResult = evaluateDeliverySla(buildDelivery(), {
    evaluatedAt: new Date('2026-05-29T10:02:00.000Z'),
  });
  assert.equal(onTimeResult.activeStage, DELIVERY_SLA_STAGES.ASSIGNMENT);
  assert.equal(onTimeResult.status, DELIVERY_SLA_STATUS.ON_TIME);
  assert.equal(onTimeResult.breachedStage, null);

  // At risk (e.g. 3.5 minutes)
  const atRiskResult = evaluateDeliverySla(buildDelivery(), {
    evaluatedAt: new Date('2026-05-29T10:03:30.000Z'),
  });
  assert.equal(atRiskResult.activeStage, DELIVERY_SLA_STAGES.ASSIGNMENT);
  assert.equal(atRiskResult.status, DELIVERY_SLA_STATUS.AT_RISK);
  assert.equal(atRiskResult.breachedStage, null);

  // Breached (e.g. 5.5 minutes)
  const breachedResult = evaluateDeliverySla(buildDelivery(), {
    evaluatedAt: new Date('2026-05-29T10:05:30.000Z'),
  });
  assert.equal(breachedResult.activeStage, DELIVERY_SLA_STAGES.ASSIGNMENT);
  assert.equal(breachedResult.status, DELIVERY_SLA_STATUS.BREACHED);
  assert.equal(breachedResult.breachedStage, DELIVERY_SLA_STAGES.ASSIGNMENT);
});

test('evaluateDeliverySla handles assigned state (Pickup SLA)', () => {
  const delivery = buildDelivery({
    deliveryStatus: 'assigned',
    assignedAt: baseDate,
  });

  // On time (e.g. 8 minutes)
  const onTimeResult = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:08:00.000Z'),
  });
  assert.equal(onTimeResult.activeStage, DELIVERY_SLA_STAGES.PICKUP);
  assert.equal(onTimeResult.status, DELIVERY_SLA_STATUS.ON_TIME);

  // At risk (e.g. 11 minutes)
  const atRiskResult = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:11:00.000Z'),
  });
  assert.equal(atRiskResult.activeStage, DELIVERY_SLA_STAGES.PICKUP);
  assert.equal(atRiskResult.status, DELIVERY_SLA_STATUS.AT_RISK);

  // Breached (e.g. 16 minutes)
  const breachedResult = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:16:00.000Z'),
  });
  assert.equal(breachedResult.activeStage, DELIVERY_SLA_STAGES.PICKUP);
  assert.equal(breachedResult.status, DELIVERY_SLA_STATUS.BREACHED);
  assert.equal(breachedResult.breachedStage, DELIVERY_SLA_STAGES.PICKUP);
});

test('evaluateDeliverySla handles picked_up state (Drop SLA)', () => {
  const delivery = buildDelivery({
    deliveryStatus: 'picked_up',
    pickedUpAt: baseDate,
  });

  // On time (e.g. 15 minutes)
  const onTimeResult = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:15:00.000Z'),
  });
  assert.equal(onTimeResult.activeStage, DELIVERY_SLA_STAGES.DROP);
  assert.equal(onTimeResult.status, DELIVERY_SLA_STATUS.ON_TIME);

  // At risk (e.g. 25 minutes)
  const atRiskResult = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:25:00.000Z'),
  });
  assert.equal(atRiskResult.activeStage, DELIVERY_SLA_STAGES.DROP);
  assert.equal(atRiskResult.status, DELIVERY_SLA_STATUS.AT_RISK);

  // Breached (e.g. 31 minutes)
  const breachedResult = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:31:00.000Z'),
  });
  assert.equal(breachedResult.activeStage, DELIVERY_SLA_STAGES.DROP);
  assert.equal(breachedResult.status, DELIVERY_SLA_STATUS.BREACHED);
  assert.equal(breachedResult.breachedStage, DELIVERY_SLA_STAGES.DROP);
});

test('evaluateDeliverySla handles terminal states', () => {
  const deliveredResult = evaluateDeliverySla(
    buildDelivery({ deliveryStatus: 'delivered', deliveredAt: baseDate }),
    { evaluatedAt: new Date('2026-05-29T10:50:00.000Z') }
  );
  assert.equal(deliveredResult.status, DELIVERY_SLA_STATUS.NOT_APPLICABLE);
  assert.equal(deliveredResult.activeStage, null);

  const failedResult = evaluateDeliverySla(
    buildDelivery({ deliveryStatus: 'failed' }),
    { evaluatedAt: new Date('2026-05-29T10:50:00.000Z') }
  );
  assert.equal(failedResult.status, DELIVERY_SLA_STATUS.NOT_APPLICABLE);

  const cancelledResult = evaluateDeliverySla(
    buildDelivery({ deliveryStatus: 'cancelled' }),
    { evaluatedAt: new Date('2026-05-29T10:50:00.000Z') }
  );
  assert.equal(cancelledResult.status, DELIVERY_SLA_STATUS.NOT_APPLICABLE);
});

test('evaluateDeliverySla triggers total SLA breach', () => {
  // Delivery created at baseDate.
  // Stage is pickup (assignedAt was just 5 mins ago, so pickup is not breached).
  // But overall time is 46 mins since creation! Total SLA breach (45 mins limit) must trigger!
  const delivery = buildDelivery({
    deliveryStatus: 'assigned',
    assignedAt: new Date('2026-05-29T10:40:00.000Z'), // assigned 5 minutes ago
    createdAt: baseDate, // created 45+ minutes ago
  });

  const result = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:46:00.000Z'), // 46 minutes since createdAt
  });

  assert.equal(result.status, DELIVERY_SLA_STATUS.BREACHED);
  assert.equal(result.breachedStage, DELIVERY_SLA_STAGES.TOTAL);
});

test('evaluateDeliverySla handles missing startedAt appropriately', () => {
  const delivery = buildDelivery({
    deliveryStatus: 'assigned',
    assignedAt: null, // missing assignedAt
  });

  const result = evaluateDeliverySla(delivery, {
    evaluatedAt: new Date('2026-05-29T10:10:00.000Z'),
  });

  assert.equal(result.status, DELIVERY_SLA_STATUS.NOT_STARTED);
  assert.equal(result.breachedStage, null);
});
