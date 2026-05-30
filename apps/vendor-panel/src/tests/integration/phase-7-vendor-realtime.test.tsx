import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useVendorRealtimeStore } from '../../modules/realtime-store-operations/store/vendor-realtime.store';
import { VENDOR_REALTIME_EVENTS } from '../../modules/realtime-store-operations/types/vendor-realtime.types';

test('Phase 7 vendor realtime prepends order and pickup state inputs', () => {
  useVendorRealtimeStore.getState().clearVendorRealtimeState();
  useVendorRealtimeStore.getState().setLastOrderEvent({
    eventName: VENDOR_REALTIME_EVENTS.ORDER_CREATED,
    orderId: 'order-1',
    storeId: 'store-1',
    orderStatus: 'placed',
    totalAmount: 100,
    itemCount: 2,
    updatedAt: '2026-05-30T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    order: null,
  });
  useVendorRealtimeStore.getState().setLastPickupEvent({
    eventName: VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    riderId: 'rider-1',
    pickupStatus: 'arrived_at_store',
    arrivedAt: '2026-05-30T10:00:00.000Z',
    pickupCompletedAt: null,
    updatedAt: '2026-05-30T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
  });

  assert.equal(useVendorRealtimeStore.getState().lastOrderEvent?.eventName, 'vendor.order_created');
  assert.equal(useVendorRealtimeStore.getState().lastPickupEvent?.pickupStatus, 'arrived_at_store');
});

test('Phase 7 vendor realtime restores order rooms on reconnect input', () => {
  useVendorRealtimeStore.getState().clearVendorRealtimeState();
  useVendorRealtimeStore.getState().addOrderRoom('order-1');

  assert.deepEqual(useVendorRealtimeStore.getState().activeOrderRooms, ['order-1']);
});
