import assert from 'node:assert/strict';
import test from 'node:test';

import { ADMIN_REALTIME_EVENTS } from '../types/control-tower-realtime.types';
import {
  applyAdminRealtimeEventsToMetrics,
  EMPTY_CONTROL_TOWER_METRICS,
} from '../utils/control-tower-metrics.util';

const now = '2026-05-30T00:00:00.000Z';

test('control tower metrics reflect latest order delivery and sla events', () => {
  const metrics = applyAdminRealtimeEventsToMetrics(
    EMPTY_CONTROL_TOWER_METRICS,
    {
      cityId: 'city-1',
      emittedAt: now,
      eventId: 'event-order-1',
      eventName: ADMIN_REALTIME_EVENTS.ORDER_CREATED,
      order: null,
      orderId: 'order-1',
      orderStatus: 'placed',
      paymentStatus: 'paid',
      updatedAt: now,
    },
    {
      cityId: 'city-1',
      delivery: null,
      deliveryAgentId: 'agent-1',
      deliveryId: 'delivery-1',
      deliveryStatus: 'en_route_to_customer',
      emittedAt: now,
      eventId: 'event-delivery-1',
      eventName: ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
      orderId: 'order-1',
      updatedAt: now,
    },
    {
      assignmentId: 'delivery-1',
      breachId: 'breach-1',
      breachedAt: now,
      breachType: 'delivery_sla',
      cityId: 'city-1',
      deliveryId: 'delivery-1',
      emittedAt: now,
      escalationLevel: 'level_1',
      eventId: 'event-sla-1',
      eventName: ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
      orderId: 'order-1',
    },
  );

  assert.equal(metrics.activeOrdersCount, 1);
  assert.equal(metrics.assignedRidersCount, 1);
  assert.equal(metrics.outForDeliveryCount, 1);
  assert.equal(metrics.openSlaBreachesCount, 1);
});

