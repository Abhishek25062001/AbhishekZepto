import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useRealtimeOrderStore } from '../store/realtime-order.store';
import {
  CUSTOMER_REALTIME_EVENTS,
  CUSTOMER_REALTIME_ORDER_STATUS,
} from '../types/realtime-order.types';

test.afterEach(() => {
  useRealtimeOrderStore.getState().clearRealtimeOrderState();
});

test('realtime order store updates socket connection state', () => {
  useRealtimeOrderStore.getState().setSocketConnected(true);

  assert.equal(useRealtimeOrderStore.getState().socketConnected, true);
  assert.equal(useRealtimeOrderStore.getState().connectionState, 'connected');
});

test('realtime order store inserts order events', () => {
  useRealtimeOrderStore.getState().addRealtimeOrderEvent({
    eventName: CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
    orderId: 'order-1',
    orderStatus: CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
    updatedAt: '2026-05-30T01:00:00.000Z',
    emittedAt: '2026-05-30T01:00:01.000Z',
  });

  const state = useRealtimeOrderStore.getState();
  assert.equal(state.realtimeOrderEvents.length, 1);
  assert.equal(state.lastRealtimeEventAt, '2026-05-30T01:00:01.000Z');
});

test('realtime order store prevents duplicate active room joins', () => {
  useRealtimeOrderStore.getState().joinOrderRoom('order-1');
  useRealtimeOrderStore.getState().joinOrderRoom('order-1');

  assert.deepEqual(useRealtimeOrderStore.getState().activeOrderRooms, ['order-1']);
});
