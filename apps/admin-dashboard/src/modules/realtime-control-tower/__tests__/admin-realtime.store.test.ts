import assert from 'node:assert/strict';
import test from 'node:test';

import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import { ADMIN_REALTIME_EVENTS } from '../types/control-tower-realtime.types';

test('admin realtime store tracks socket state and city rooms', () => {
  useAdminRealtimeStore.getState().clearAdminRealtimeState();

  useAdminRealtimeStore.getState().setConnectionState('connected');
  useAdminRealtimeStore.getState().setSocketConnected(true);
  useAdminRealtimeStore.getState().addCityRoom('city-1');
  useAdminRealtimeStore.getState().addCityRoom('city-1');

  assert.equal(useAdminRealtimeStore.getState().socketConnected, true);
  assert.deepEqual(useAdminRealtimeStore.getState().activeCityRooms, ['city-1']);

  useAdminRealtimeStore.getState().removeCityRoom('city-1');

  assert.deepEqual(useAdminRealtimeStore.getState().activeCityRooms, []);
});

test('admin realtime store records latest order delivery and sla events', () => {
  useAdminRealtimeStore.getState().clearAdminRealtimeState();
  const now = new Date('2026-05-30T00:00:00.000Z').toISOString();

  useAdminRealtimeStore.getState().setLastOrderEvent({
    cityId: 'city-1',
    emittedAt: now,
    eventId: 'event-order-1',
    eventName: ADMIN_REALTIME_EVENTS.ORDER_CREATED,
    order: null,
    orderId: 'order-1',
    orderStatus: 'placed',
    paymentStatus: 'paid',
    updatedAt: now,
  });
  useAdminRealtimeStore.getState().setLastDeliveryEvent({
    cityId: 'city-1',
    delivery: null,
    deliveryAgentId: 'agent-1',
    deliveryId: 'delivery-1',
    deliveryStatus: 'assigned',
    emittedAt: now,
    eventId: 'event-delivery-1',
    eventName: ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
    orderId: 'order-1',
    updatedAt: now,
  });
  useAdminRealtimeStore.getState().setLastSlaEvent({
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
  });

  assert.equal(useAdminRealtimeStore.getState().lastOrderEvent?.orderId, 'order-1');
  assert.equal(
    useAdminRealtimeStore.getState().lastDeliveryEvent?.deliveryId,
    'delivery-1',
  );
  assert.equal(useAdminRealtimeStore.getState().lastSlaEvent?.breachId, 'breach-1');
  assert.equal(useAdminRealtimeStore.getState().lastRealtimeEventAt, now);
});

