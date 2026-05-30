import assert from 'node:assert/strict';
import test from 'node:test';

import { ADMIN_REALTIME_EVENTS } from '../types/control-tower-realtime.types';
import {
  shouldIgnoreAdminDeliveryRealtimeEvent,
  shouldIgnoreAdminOrderRealtimeEvent,
  shouldIgnoreAdminSlaRealtimeEvent,
} from '../utils/admin-realtime-stale-event.util';

test('ignores stale order events for the same order', () => {
  const latest = {
    cityId: 'city-1',
    emittedAt: null,
    eventId: null,
    eventName: ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    order: null,
    orderId: 'order-1',
    orderStatus: 'accepted',
    paymentStatus: 'paid',
    updatedAt: '2026-05-30T01:00:00.000Z',
  } as const;

  const incoming = {
    ...latest,
    orderStatus: 'placed',
    updatedAt: '2026-05-30T00:00:00.000Z',
  } as const;

  assert.equal(shouldIgnoreAdminOrderRealtimeEvent(incoming, latest), true);
});

test('does not ignore newer delivery events', () => {
  const latest = {
    cityId: 'city-1',
    delivery: null,
    deliveryAgentId: 'agent-1',
    deliveryId: 'delivery-1',
    deliveryStatus: 'assigned',
    emittedAt: null,
    eventId: null,
    eventName: ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED,
    orderId: 'order-1',
    updatedAt: '2026-05-30T00:00:00.000Z',
  } as const;

  const incoming = {
    ...latest,
    deliveryStatus: 'picked_up',
    updatedAt: '2026-05-30T01:00:00.000Z',
  } as const;

  assert.equal(shouldIgnoreAdminDeliveryRealtimeEvent(incoming, latest), false);
});

test('ignores duplicate sla breach events', () => {
  const latest = {
    assignmentId: 'assignment-1',
    breachId: 'breach-1',
    breachedAt: '2026-05-30T00:00:00.000Z',
    breachType: 'delivery_sla',
    cityId: 'city-1',
    deliveryId: 'delivery-1',
    emittedAt: null,
    escalationLevel: null,
    eventId: null,
    eventName: ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
    orderId: 'order-1',
  } as const;

  assert.equal(shouldIgnoreAdminSlaRealtimeEvent(latest, latest), true);
});

