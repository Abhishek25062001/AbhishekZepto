"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const realtime_order_store_1 = require("../../modules/realtime-order-experience/store/realtime-order.store");
const realtime_connection_state_util_1 = require("../../modules/realtime-order-experience/utils/realtime-connection-state.util");
(0, node_test_1.default)('customer realtime reconnect preserves active rooms for restore', () => {
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom('order-restore-1');
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom('order-restore-2');
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom('order-restore-1');
    realtime_order_store_1.useRealtimeOrderStore.getState().setSocketConnected(true);
    realtime_order_store_1.useRealtimeOrderStore.getState().setSocketConnected(false);
    realtime_order_store_1.useRealtimeOrderStore.getState().setConnectionState('reconnecting');
    const reconnectingState = realtime_order_store_1.useRealtimeOrderStore.getState();
    const roomsToRestore = (0, realtime_connection_state_util_1.getRealtimeRoomsToRestore)(reconnectingState.activeOrderRooms);
    strict_1.default.equal(reconnectingState.socketConnected, false);
    strict_1.default.equal(reconnectingState.connectionState, 'reconnecting');
    strict_1.default.deepEqual(roomsToRestore, ['order-restore-1', 'order-restore-2']);
    realtime_order_store_1.useRealtimeOrderStore.getState().setSocketConnected(true);
    const restoredState = realtime_order_store_1.useRealtimeOrderStore.getState();
    strict_1.default.equal(restoredState.connectionState, 'connected');
    strict_1.default.deepEqual(restoredState.activeOrderRooms, roomsToRestore);
});
(0, node_test_1.default)('customer realtime reconnect separates auth failures from transient disconnects', () => {
    strict_1.default.equal((0, realtime_connection_state_util_1.isRealtimeAuthSocketFailure)('invalid_socket_token'), true);
    strict_1.default.equal((0, realtime_connection_state_util_1.isRealtimeAuthSocketFailure)(new Error('unauthorized socket')), true);
    strict_1.default.equal((0, realtime_connection_state_util_1.isRealtimeAuthSocketFailure)('transport close'), false);
});
