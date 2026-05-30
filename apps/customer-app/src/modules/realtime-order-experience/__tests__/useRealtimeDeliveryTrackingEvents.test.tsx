import assert from 'node:assert/strict';
import { test } from 'node:test';

import { handleRealtimeDeliveryTrackingPayload } from '../hooks/useRealtimeDeliveryTrackingEvents';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import { CUSTOMER_REALTIME_EVENTS } from '../types/realtime-order.types';

const buildLocationPayload = (lastLocationUpdatedAt: string) => ({
  emittedAt: lastLocationUpdatedAt,
  data: {
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    deliveryAgentId: 'agent-1',
    customerId: 'customer-1',
    storeId: 'store-1',
    cityId: 'city-1',
    progressStatus: 'en_route_to_customer',
    currentLatitude: 28.6139,
    currentLongitude: 77.209,
    lastLocationUpdatedAt,
    updatedAt: lastLocationUpdatedAt,
  },
});

test.afterEach(() => {
  useRealtimeOrderStore.getState().clearRealtimeOrderState();
});

test('delivery tracking event handler stores location event', () => {
  handleRealtimeDeliveryTrackingPayload(
    buildLocationPayload('2026-05-30T01:00:00.000Z'),
    CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );

  assert.equal(useRealtimeOrderStore.getState().deliveryTrackingEvents.length, 1);
});

test('delivery tracking event handler ignores stale location event', () => {
  handleRealtimeDeliveryTrackingPayload(
    buildLocationPayload('2026-05-30T01:02:00.000Z'),
    CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );
  handleRealtimeDeliveryTrackingPayload(
    buildLocationPayload('2026-05-30T01:01:00.000Z'),
    CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );

  assert.equal(useRealtimeOrderStore.getState().deliveryTrackingEvents.length, 1);
});
