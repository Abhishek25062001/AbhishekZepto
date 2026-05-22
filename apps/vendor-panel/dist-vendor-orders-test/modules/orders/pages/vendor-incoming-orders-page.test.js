"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_orders_display_util_1 = require("../utils/vendor-orders-display.util");
const vendor_orders_query_util_1 = require("../utils/vendor-orders-query.util");
(0, node_test_1.test)('incoming orders page defines expected scan columns', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.INCOMING_ORDER_LIST_COLUMNS], [
        'Order',
        'Order status',
        'Store status',
        'Payment',
        'Total',
        'Placed',
        'SLA',
    ]);
});
(0, node_test_1.test)('incoming orders page uses incoming order defaults', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildIncomingOrdersQuery)({ page: 3, limit: 15 }), {
        page: 3,
        limit: 15,
        status: 'placed',
        storeStatus: 'pending_acceptance',
    });
});
(0, node_test_1.test)('incoming order detail view keeps expected read-only sections', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.INCOMING_ORDER_DETAIL_SECTIONS], ['Summary', 'Items', 'State']);
});
