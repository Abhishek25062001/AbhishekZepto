"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_orders_display_util_1 = require("../utils/admin-orders-display.util");
const admin_orders_display_util_2 = require("../utils/admin-orders-display.util");
(0, node_test_1.test)('admin order list columns match Module 11 contract', () => {
    strict_1.default.deepEqual([...admin_orders_display_util_1.ADMIN_ORDER_LIST_COLUMNS], [
        'Order',
        'Customer',
        'Store',
        'Status',
        'Store status',
        'Payment',
        'Total',
        'Created',
        'SLA',
    ]);
});
(0, node_test_1.test)('admin order detail sections match Module 11 contract', () => {
    strict_1.default.deepEqual([...admin_orders_display_util_2.ADMIN_ORDER_DETAIL_SECTIONS], [
        'Summary',
        'Payment',
        'Items',
        'State',
        'Timeline',
        'SLA',
        'Cancellation',
    ]);
});
