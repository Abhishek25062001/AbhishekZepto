"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const order_status_label_util_1 = require("./order-status-label.util");
(0, node_test_1.test)('getOrderStatusLabel returns customer-safe phase 5 labels', () => {
    strict_1.default.deepEqual([
        'placed',
        'accepted',
        'picking',
        'packing',
        'ready_for_pickup',
        'shipped_placeholder',
        'delivered_placeholder',
        'cancelled',
    ].map((status) => (0, order_status_label_util_1.getOrderStatusLabel)(status)), [
        'Order placed',
        'Store accepted',
        'Picking items',
        'Packing order',
        'Ready for pickup',
        'On the way',
        'Delivered',
        'Cancelled',
    ]);
});
(0, node_test_1.test)('getOrderStatusLabel falls back for unknown status', () => {
    strict_1.default.equal((0, order_status_label_util_1.getOrderStatusLabel)('unknown'), 'Order placed');
});
(0, node_test_1.test)('status helpers identify terminal and cancellable states', () => {
    strict_1.default.equal((0, order_status_label_util_1.canCustomerCancelOrderStatus)('placed'), true);
    strict_1.default.equal((0, order_status_label_util_1.canCustomerCancelOrderStatus)('accepted'), false);
    strict_1.default.equal((0, order_status_label_util_1.isTerminalOrderStatus)('cancelled'), true);
    strict_1.default.equal((0, order_status_label_util_1.isTerminalOrderStatus)('delivered_placeholder'), true);
    strict_1.default.equal((0, order_status_label_util_1.isTerminalOrderStatus)('ready_for_pickup'), false);
    strict_1.default.equal((0, order_status_label_util_1.isCancelledOrderStatus)('cancelled'), true);
});
(0, node_test_1.test)('getOrderStatusDescription returns customer-safe fallback copy', () => {
    strict_1.default.equal((0, order_status_label_util_1.getOrderStatusDescription)('picking'), 'The store is picking your items.');
    strict_1.default.equal((0, order_status_label_util_1.getOrderStatusDescription)('unknown'), 'Your order was placed successfully.');
});
