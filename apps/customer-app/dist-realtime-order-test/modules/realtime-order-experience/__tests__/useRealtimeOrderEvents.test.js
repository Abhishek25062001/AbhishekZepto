"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const useRealtimeOrderEvents_1 = require("../hooks/useRealtimeOrderEvents");
const realtime_order_store_1 = require("../store/realtime-order.store");
const realtime_order_types_1 = require("../types/realtime-order.types");
node_test_1.test.afterEach(() => {
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
});
(0, node_test_1.test)('order event handler stores packed realtime order event', () => {
    (0, useRealtimeOrderEvents_1.handleRealtimeOrderPayload)({
        emittedAt: '2026-05-30T01:00:01.000Z',
        data: {
            orderId: 'order-1',
            orderStatus: 'packing',
            updatedAt: '2026-05-30T01:00:00.000Z',
        },
    }, realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_PACKED);
    const [event] = realtime_order_store_1.useRealtimeOrderStore.getState().realtimeOrderEvents;
    strict_1.default.equal(event?.orderStatus, realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED);
});
(0, node_test_1.test)('order event handler stores delivered realtime order event', () => {
    (0, useRealtimeOrderEvents_1.handleRealtimeOrderPayload)({
        emittedAt: '2026-05-30T01:05:01.000Z',
        data: {
            orderId: 'order-1',
            orderStatus: 'delivered',
            updatedAt: '2026-05-30T01:05:00.000Z',
        },
    }, realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED);
    const [event] = realtime_order_store_1.useRealtimeOrderStore.getState().realtimeOrderEvents;
    strict_1.default.equal(event?.orderStatus, realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED);
});
