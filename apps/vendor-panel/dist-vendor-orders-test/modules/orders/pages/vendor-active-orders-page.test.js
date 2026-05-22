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
(0, node_test_1.test)('active orders page defines expected scan columns', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.ACTIVE_ORDER_LIST_COLUMNS], [
        'Order',
        'Order status',
        'Picker',
        'Packing',
        'Items',
        'Total',
        'Accepted',
        'SLA',
    ]);
});
(0, node_test_1.test)('active orders page uses accepted store order defaults', () => {
    strict_1.default.deepEqual((0, vendor_orders_query_util_1.buildActiveOrdersQuery)({ page: 1, limit: 50 }), {
        page: 1,
        limit: 50,
        storeStatus: 'accepted',
    });
});
(0, node_test_1.test)('active order status helper includes only active workflow states', () => {
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('accepted'), true);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('picking'), true);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('packing'), true);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('ready_for_pickup'), true);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('placed'), false);
    strict_1.default.equal((0, vendor_orders_query_util_1.isActiveVendorOrderStatus)('cancelled'), false);
});
(0, node_test_1.test)('active order detail view starts with expected read-only sections', () => {
    strict_1.default.deepEqual([...vendor_orders_display_util_1.ACTIVE_ORDER_DETAIL_SECTIONS], ['Summary', 'Items', 'State']);
});
(0, node_test_1.test)('start picking guard allows only accepted orders before picking starts', () => {
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canStartVendorOrderPicking)({
        orderStatus: 'accepted',
        storeStatus: 'accepted',
        pickerStatus: null,
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canStartVendorOrderPicking)({
        orderStatus: 'accepted',
        storeStatus: 'accepted',
        pickerStatus: 'pending',
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canStartVendorOrderPicking)({
        orderStatus: 'picking',
        storeStatus: 'accepted',
        pickerStatus: 'in_progress',
    }), false);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canStartVendorOrderPicking)({
        orderStatus: 'accepted',
        storeStatus: 'pending_acceptance',
        pickerStatus: null,
    }), false);
});
(0, node_test_1.test)('item picking guard allows updates only during active picking', () => {
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canUpdateVendorOrderItemPicking)({
        orderStatus: 'picking',
        storeStatus: 'accepted',
        pickerStatus: 'in_progress',
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canUpdateVendorOrderItemPicking)({
        orderStatus: 'accepted',
        storeStatus: 'accepted',
        pickerStatus: null,
    }), false);
});
(0, node_test_1.test)('remaining item quantity subtracts picked and missing quantities', () => {
    strict_1.default.equal((0, vendor_orders_workflow_util_1.getVendorOrderItemRemainingQuantity)({
        missingQuantity: 1,
        pickedQuantity: 2,
        quantity: 5,
    }), 2);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.getVendorOrderItemRemainingQuantity)({
        missingQuantity: 3,
        pickedQuantity: 3,
        quantity: 5,
    }), 0);
});
(0, node_test_1.test)('complete picking guard requires active picking and resolved items', () => {
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCompleteVendorOrderPicking)({
        items: [
            {
                pickingStatus: 'picked',
            },
            {
                pickingStatus: 'partial',
            },
        ],
        orderStatus: 'picking',
        storeStatus: 'accepted',
        pickerStatus: 'in_progress',
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCompleteVendorOrderPicking)({
        items: [
            {
                pickingStatus: 'pending',
            },
        ],
        orderStatus: 'picking',
        storeStatus: 'accepted',
        pickerStatus: 'in_progress',
    }), false);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCompleteVendorOrderPicking)({
        items: [
            {
                pickingStatus: 'picked',
            },
        ],
        orderStatus: 'accepted',
        storeStatus: 'accepted',
        pickerStatus: null,
    }), false);
});
(0, node_test_1.test)('packing guards follow backend transition order', () => {
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canStartVendorOrderPacking)({
        orderStatus: 'picking',
        storeStatus: 'accepted',
        pickerStatus: 'completed',
        packingStatus: null,
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canCompleteVendorOrderPacking)({
        orderStatus: 'packing',
        storeStatus: 'accepted',
        pickerStatus: 'completed',
        packingStatus: 'in_progress',
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canMarkVendorOrderReadyForPickup)({
        orderStatus: 'packing',
        storeStatus: 'accepted',
        pickerStatus: 'completed',
        packingStatus: 'completed',
    }), true);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canStartVendorOrderPacking)({
        orderStatus: 'picking',
        storeStatus: 'accepted',
        pickerStatus: 'in_progress',
        packingStatus: null,
    }), false);
    strict_1.default.equal((0, vendor_orders_workflow_util_1.canMarkVendorOrderReadyForPickup)({
        orderStatus: 'ready_for_pickup',
        storeStatus: 'accepted',
        pickerStatus: 'completed',
        packingStatus: 'ready_for_pickup',
    }), false);
});
