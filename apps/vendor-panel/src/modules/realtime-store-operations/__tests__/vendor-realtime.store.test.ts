import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import { VENDOR_REALTIME_EVENTS } from '../types/vendor-realtime.types';

test('vendor realtime store tracks socket state and clears connection errors', () => {
  const store = useVendorRealtimeStore.getState();
  store.clearVendorRealtimeState();
  store.setConnectionError('offline');
  store.setSocketConnected(true);

  const state = useVendorRealtimeStore.getState();
  assert.equal(state.socketConnected, true);
  assert.equal(state.connectionState, 'connected');
  assert.equal(state.connectionError, null);
});

test('vendor realtime store tracks order rooms without duplicates', () => {
  const store = useVendorRealtimeStore.getState();
  store.clearVendorRealtimeState();

  store.addOrderRoom(' order-1 ');
  store.addOrderRoom('order-1');
  assert.deepEqual(useVendorRealtimeStore.getState().activeOrderRooms, ['order-1']);

  useVendorRealtimeStore.getState().removeOrderRoom('order-1');
  assert.deepEqual(useVendorRealtimeStore.getState().activeOrderRooms, []);
});

test('vendor realtime store clears state on logout', () => {
  const store = useVendorRealtimeStore.getState();
  store.clearVendorRealtimeState();
  store.addOrderRoom('order-1');
  store.setLastOrderEvent({
    eventName: VENDOR_REALTIME_EVENTS.ORDER_CREATED,
    orderId: 'order-1',
    storeId: 'store-1',
    orderStatus: 'placed',
    totalAmount: 120,
    itemCount: 3,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    order: null,
  });

  store.clearVendorRealtimeState();

  const state = useVendorRealtimeStore.getState();
  assert.equal(state.socketConnected, false);
  assert.deepEqual(state.activeOrderRooms, []);
  assert.equal(state.lastOrderEvent, null);
  assert.equal(state.lastRealtimeEventAt, null);
});

