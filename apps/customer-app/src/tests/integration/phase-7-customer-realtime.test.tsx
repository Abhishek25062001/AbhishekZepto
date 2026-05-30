import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useRealtimeOrderStore } from '../../modules/realtime-order-experience/store/realtime-order.store';
import { CUSTOMER_REALTIME_EVENTS } from '../../modules/realtime-order-experience/types/realtime-order.types';

test('Phase 7 customer realtime records order and delivery events without refresh', () => {
  useRealtimeOrderStore.getState().clearRealtimeOrderState();

  useRealtimeOrderStore.getState().addRealtimeOrderEvent({
    eventName: CUSTOMER_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    orderId: 'order-1',
    orderStatus: 'accepted',
    updatedAt: '2026-05-30T10:00:00.000Z',
  });
  useRealtimeOrderStore.getState().addDeliveryTrackingEvent({
    eventName: CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    deliveryAgentId: 'agent-1',
    customerId: 'customer-1',
    storeId: 'store-1',
    cityId: 'city-1',
    progressStatus: 'en_route_to_customer',
    currentLatitude: 12.9,
    currentLongitude: 77.6,
    lastLocationUpdatedAt: '2026-05-30T10:00:00.000Z',
    estimatedDeliveryAt: null,
    updatedAt: '2026-05-30T10:00:00.000Z',
  });

  assert.equal(useRealtimeOrderStore.getState().realtimeOrderEvents.length, 1);
  assert.equal(useRealtimeOrderStore.getState().deliveryTrackingEvents[0]?.currentLatitude, 12.9);
});

test('Phase 7 customer realtime tracks disconnect and room restoration inputs', () => {
  useRealtimeOrderStore.getState().clearRealtimeOrderState();
  useRealtimeOrderStore.getState().joinOrderRoom('order-1');
  useRealtimeOrderStore.getState().setSocketConnected(false);

  assert.deepEqual(useRealtimeOrderStore.getState().activeOrderRooms, ['order-1']);
  assert.equal(useRealtimeOrderStore.getState().connectionState, 'disconnected');
});
