import assert from 'node:assert/strict';
import test from 'node:test';

import { handleRealtimeDeliveryTrackingPayload } from '../../modules/realtime-order-experience/hooks/useRealtimeDeliveryTrackingEvents';
import { handleRealtimeOrderPayload } from '../../modules/realtime-order-experience/hooks/useRealtimeOrderEvents';
import { useRealtimeOrderStore } from '../../modules/realtime-order-experience/store/realtime-order.store';
import {
  CUSTOMER_REALTIME_EVENTS,
  CUSTOMER_REALTIME_ORDER_STATUS,
} from '../../modules/realtime-order-experience/types/realtime-order.types';

test('customer realtime order flow joins a room and applies order and delivery events', () => {
  const orderId = 'order-realtime-1';
  useRealtimeOrderStore.getState().clearRealtimeOrderState();

  useRealtimeOrderStore.getState().setSocketConnected(true);
  useRealtimeOrderStore.getState().joinOrderRoom(orderId);
  handleRealtimeOrderPayload(
    {
      eventName: CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
      emittedAt: '2026-05-30T08:00:00.000Z',
      data: {
        eventId: 'evt-out-for-delivery',
        orderId,
        orderStatus: 'shipped',
        updatedAt: '2026-05-30T08:00:00.000Z',
      },
    },
    CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
  );
  handleRealtimeDeliveryTrackingPayload(
    {
      eventName: CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
      emittedAt: '2026-05-30T08:01:00.000Z',
      data: {
        eventId: 'evt-location',
        orderId,
        assignmentId: 'assignment-1',
        deliveryAgentId: 'agent-1',
        customerId: 'customer-1',
        storeId: 'store-1',
        cityId: 'city-1',
        progressStatus: 'out_for_delivery',
        currentLatitude: 19.076,
        currentLongitude: 72.8777,
        lastLocationUpdatedAt: '2026-05-30T08:01:00.000Z',
        estimatedDeliveryAt: '2026-05-30T08:20:00.000Z',
        updatedAt: '2026-05-30T08:01:00.000Z',
      },
    },
    CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );
  handleRealtimeOrderPayload(
    {
      eventName: CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
      emittedAt: '2026-05-30T08:18:00.000Z',
      data: {
        eventId: 'evt-delivered',
        orderId,
        orderStatus: 'delivered',
        updatedAt: '2026-05-30T08:18:00.000Z',
      },
    },
    CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
  );

  const state = useRealtimeOrderStore.getState();
  const latestOrderEvent = state.realtimeOrderEvents.at(-1);
  const latestTrackingEvent = state.deliveryTrackingEvents.at(-1);

  assert.deepEqual(state.activeOrderRooms, [orderId]);
  assert.equal(latestOrderEvent?.orderStatus, CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED);
  assert.equal(latestTrackingEvent?.currentLatitude, 19.076);
  assert.equal(latestTrackingEvent?.currentLongitude, 72.8777);
  assert.equal(state.lastRealtimeEventAt, '2026-05-30T08:18:00.000Z');
});
