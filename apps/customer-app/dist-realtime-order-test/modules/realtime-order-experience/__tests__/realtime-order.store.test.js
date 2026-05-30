"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const realtime_order_store_1 = require("../store/realtime-order.store");
const realtime_order_types_1 = require("../types/realtime-order.types");
node_test_1.test.afterEach(() => {
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
});
(0, node_test_1.test)('realtime order store updates socket connection state', () => {
    realtime_order_store_1.useRealtimeOrderStore.getState().setSocketConnected(true);
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().socketConnected, true);
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().connectionState, 'connected');
});
(0, node_test_1.test)('realtime order store inserts order events', () => {
    realtime_order_store_1.useRealtimeOrderStore.getState().addRealtimeOrderEvent({
        eventName: realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
        orderId: 'order-1',
        orderStatus: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
        updatedAt: '2026-05-30T01:00:00.000Z',
        emittedAt: '2026-05-30T01:00:01.000Z',
    });
    const state = realtime_order_store_1.useRealtimeOrderStore.getState();
    strict_1.default.equal(state.realtimeOrderEvents.length, 1);
    strict_1.default.equal(state.lastRealtimeEventAt, '2026-05-30T01:00:01.000Z');
});
(0, node_test_1.test)('realtime order store prevents duplicate active room joins', () => {
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom('order-1');
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom('order-1');
    strict_1.default.deepEqual(realtime_order_store_1.useRealtimeOrderStore.getState().activeOrderRooms, ['order-1']);
});
