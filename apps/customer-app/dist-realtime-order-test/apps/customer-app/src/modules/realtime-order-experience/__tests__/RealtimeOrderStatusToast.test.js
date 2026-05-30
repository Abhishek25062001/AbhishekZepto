"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const realtime_order_types_1 = require("../types/realtime-order.types");
const realtime_order_status_toast_util_1 = require("../utils/realtime-order-status-toast.util");
(0, node_test_1.test)('accepted order toast message is returned', () => {
    strict_1.default.equal((0, realtime_order_status_toast_util_1.getRealtimeOrderStatusToastMessage)(realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED), 'Your order has been accepted');
});
(0, node_test_1.test)('packed order toast message is returned', () => {
    strict_1.default.equal((0, realtime_order_status_toast_util_1.getRealtimeOrderStatusToastMessage)(realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED), 'Your order is packed');
});
(0, node_test_1.test)('delivered order toast message is returned', () => {
    strict_1.default.equal((0, realtime_order_status_toast_util_1.getRealtimeOrderStatusToastMessage)(realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED), 'Your order has been delivered');
});
