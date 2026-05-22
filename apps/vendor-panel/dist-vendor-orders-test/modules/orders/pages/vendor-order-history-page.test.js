"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_orders_display_util_1 = require("../utils/vendor-orders-display.util");
const vendor_orders_query_util_1 = require("../utils/vendor-orders-query.util");
const vendor_orders_workflow_util_1 = require("../utils/vendor-orders-workflow.util");
(0, node_test_1.test)('order history page defines expected scan columns', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.ORDER_HISTORY_LIST_COLUMNS], [
        'Order',
        'Order status',
        'Store status',
        'Payment',
        'Total',
        'Placed',
        'Activity',
    ]);
});
(0, node_test_1.test)('order history page uses neutral default query', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildOrderHistoryQuery)({ page: 1, limit: 20 }), {
        page: 1,
        limit: 20,
    });
});
(0, node_test_1.test)('order history detail starts with read-only sections', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.ORDER_HISTORY_DETAIL_SECTIONS], ['Summary', 'Items', 'Totals', 'Timeline']);
});
(0, node_test_1.test)('store cancellation guard defers final eligibility to backend active states', () => {
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCancelVendorStoreOrder)({
        orderStatus: 'placed',
        storeStatus: 'pending_acceptance',
        pickerStatus: null,
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCancelVendorStoreOrder)({
        orderStatus: 'packing',
        storeStatus: 'accepted',
        pickerStatus: 'completed',
        packingStatus: 'in_progress',
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCancelVendorStoreOrder)({
        orderStatus: 'ready_for_pickup',
        storeStatus: 'accepted',
        pickerStatus: 'completed',
        packingStatus: 'ready_for_pickup',
    }), false);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCancelVendorStoreOrder)({
        orderStatus: 'cancelled',
        storeStatus: 'accepted',
        pickerStatus: null,
    }), false);
});
(0, node_test_1.test)('order history cancellation display helpers prefer cancellation metadata', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.ORDER_HISTORY_CANCELLATION_FIELDS], [
        'Cancelled',
        'Reason',
        'Refund review',
    ]);
    strict_1.default.equal((0, vendor_orders_display_util_1.getVendorOrderCancellationReason)({
        cancellationReason: 'Store closed',
        rejectionReason: 'Rejected by store',
    }), 'Store closed');
    strict_1.default.equal((0, vendor_orders_display_util_1.getVendorOrderCancellationReason)({
        cancellationReason: null,
        rejectionReason: 'Rejected by store',
    }), 'Rejected by store');
    strict_1.default.equal((0, vendor_orders_display_util_1.formatVendorOrderRefundReview)(true), 'Required');
    strict_1.default.equal((0, vendor_orders_display_util_1.formatVendorOrderRefundReview)(false), 'Not required');
});
