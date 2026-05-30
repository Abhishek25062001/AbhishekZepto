import assert from 'node:assert/strict';
import test from 'node:test';

import { useRealtimeOrderStore } from '../../modules/realtime-order-experience/store/realtime-order.store';
import {
  getRealtimeRoomsToRestore,
  isRealtimeAuthSocketFailure,
} from '../../modules/realtime-order-experience/utils/realtime-connection-state.util';

test('customer realtime reconnect preserves active rooms for restore', () => {
  useRealtimeOrderStore.getState().clearRealtimeOrderState();

  useRealtimeOrderStore.getState().joinOrderRoom('order-restore-1');
  useRealtimeOrderStore.getState().joinOrderRoom('order-restore-2');
  useRealtimeOrderStore.getState().joinOrderRoom('order-restore-1');
  useRealtimeOrderStore.getState().setSocketConnected(true);
  useRealtimeOrderStore.getState().setSocketConnected(false);
  useRealtimeOrderStore.getState().setConnectionState('reconnecting');

  const reconnectingState = useRealtimeOrderStore.getState();
  const roomsToRestore = getRealtimeRoomsToRestore(reconnectingState.activeOrderRooms);

  assert.equal(reconnectingState.socketConnected, false);
  assert.equal(reconnectingState.connectionState, 'reconnecting');
  assert.deepEqual(roomsToRestore, ['order-restore-1', 'order-restore-2']);

  useRealtimeOrderStore.getState().setSocketConnected(true);

  const restoredState = useRealtimeOrderStore.getState();
  assert.equal(restoredState.connectionState, 'connected');
  assert.deepEqual(restoredState.activeOrderRooms, roomsToRestore);
});

test('customer realtime reconnect separates auth failures from transient disconnects', () => {
  assert.equal(isRealtimeAuthSocketFailure('invalid_socket_token'), true);
  assert.equal(isRealtimeAuthSocketFailure(new Error('unauthorized socket')), true);
  assert.equal(isRealtimeAuthSocketFailure('transport close'), false);
});
