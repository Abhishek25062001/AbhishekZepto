"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_orders_query_util_1 = require("./vendor-orders-query.util");
(0, node_test_1.test)('buildVendorOrderListQueryParams removes empty values', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildVendorOrderListQueryParams)({
        page: 2,
        limit: 20,
        status: 'placed',
        storeStatus: undefined,
    }), {
        page: 2,
        limit: 20,
        status: 'placed',
    });
});
(0, node_test_1.test)('buildIncomingOrdersQuery defaults to placed pending acceptance orders', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildIncomingOrdersQuery)({ page: 1, limit: 10 }), {
        page: 1,
        limit: 10,
        status: 'placed',
        storeStatus: 'pending_acceptance',
    });
});
(0, node_test_1.test)('buildIncomingOrdersQuery allows explicit override for refresh states', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildIncomingOrdersQuery)({ status: 'accepted' }), {
        status: 'accepted',
        storeStatus: 'pending_acceptance',
    });
});
(0, node_test_1.test)('buildActiveOrdersQuery defaults to accepted store orders without forcing one lifecycle status', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildActiveOrdersQuery)({ page: 2, limit: 15 }), {
        page: 2,
        limit: 15,
        storeStatus: 'accepted',
    });
});
(0, node_test_1.test)('active order statuses exclude placed and cancelled states', () => {
    strict_1.default.deepEqual([...vendor_orders_query_util_1.ACTIVE_ORDER_STATUSES], [
        'accepted',
        'picking',
        'packing',
        'ready_for_pickup',
    ]);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('accepted'), true);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('placed'), false);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('cancelled'), false);
});
(0, node_test_1.test)('buildOrderHistoryQuery uses only provided supported store order filters', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildOrderHistoryQuery)({
        limit: 25,
        page: 4,
        paymentStatus: 'paid',
        status: 'cancelled',
        storeStatus: 'accepted',
    }), {
        limit: 25,
        page: 4,
        paymentStatus: 'paid',
        status: 'cancelled',
        storeStatus: 'accepted',
    });
});
(0, node_test_1.test)('buildOrderHistoryQuery resets cleanly when filters are cleared by caller', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildOrderHistoryQuery)({
        limit: 20,
        page: undefined,
        paymentStatus: undefined,
        status: undefined,
        storeStatus: undefined,
    }), {
        limit: 20,
    });
});
(0, node_test_1.test)('buildOrderHistoryQuery omits empty filter values', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildOrderHistoryQuery)({
        limit: 20,
        page: 1,
        paymentStatus: undefined,
        status: undefined,
        storeStatus: undefined,
    }), {
        limit: 20,
        page: 1,
    });
});
(0, node_test_1.test)('history order statuses use existing lifecycle statuses only', () => {
    strict_1.default.deepEqual([...vendor_orders_query_util_1.HISTORY_ORDER_STATUSES], [
        'accepted',
        'cancelled',
        'packing',
        'picking',
        'placed',
        'ready_for_pickup',
    ]);
    strict_1.default.equal((0, vendor_orders_query_util_1.isHistoryVendorOrderStatus)('cancelled'), true);
    strict_1.default.equal((0, vendor_orders_query_util_1.isHistoryVendorOrderStatus)('ready_for_pickup'), true);
});
