import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useAdminRealtimeStore } from '../../modules/realtime-control-tower/store/admin-realtime.store';
import { ADMIN_REALTIME_EVENTS } from '../../modules/realtime-control-tower/types/control-tower-realtime.types';

test('Phase 7 admin realtime tracks order delivery and SLA events', () => {
  useAdminRealtimeStore.getState().clearAdminRealtimeState();
  useAdminRealtimeStore.getState().setLastOrderEvent({
    eventName: ADMIN_REALTIME_EVENTS.ORDER_CREATED,
    orderId: 'order-1',
    cityId: 'city-1',
    orderStatus: 'placed',
    paymentStatus: 'paid',
    updatedAt: '2026-05-30T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    order: null,
  });
  useAdminRealtimeStore.getState().setLastDeliveryEvent({
    eventName: ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
    deliveryId: 'delivery-1',
    orderId: 'order-1',
    cityId: 'city-1',
    deliveryAgentId: 'agent-1',
    deliveryStatus: 'en_route_to_customer',
    updatedAt: '2026-05-30T10:01:00.000Z',
    emittedAt: null,
    eventId: null,
    delivery: null,
  });
  useAdminRealtimeStore.getState().setLastSlaEvent({
    eventName: ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
    breachId: 'breach-1',
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    deliveryId: 'delivery-1',
    cityId: 'city-1',
    breachType: 'delivery_delay',
    escalationLevel: 'level_1',
    breachedAt: '2026-05-30T10:02:00.000Z',
    emittedAt: null,
    eventId: null,
  });

  assert.equal(useAdminRealtimeStore.getState().lastOrderEvent?.orderId, 'order-1');
  assert.equal(useAdminRealtimeStore.getState().lastDeliveryEvent?.deliveryId, 'delivery-1');
  assert.equal(useAdminRealtimeStore.getState().lastSlaEvent?.breachId, 'breach-1');
});

test('Phase 7 admin realtime keeps city rooms for reconnect fallback', () => {
  useAdminRealtimeStore.getState().clearAdminRealtimeState();
  useAdminRealtimeStore.getState().addCityRoom('city-1');
  useAdminRealtimeStore.getState().setSocketConnected(false);

  assert.deepEqual(useAdminRealtimeStore.getState().activeCityRooms, ['city-1']);
  assert.equal(useAdminRealtimeStore.getState().connectionState, 'disconnected');
});
