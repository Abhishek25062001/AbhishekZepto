"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_orders_permissions_util_1 = require("./vendor-orders-permissions.util");
const orderForPermissions = (override) => ({
    acceptedAt: null,
    addressSnapshot: {},
    assignedPickerId: null,
    cancellationReason: null,
    cancelledAt: null,
    checkoutSessionId: 'checkout-1',
    createdAt: '2026-05-21T00:00:00.000Z',
    currency: 'INR',
    customerId: 'customer-1',
    deliveryFeeAmount: 0,
    discountAmount: 0,
    grandTotal: 100,
    inventoryConfirmed: true,
    itemCount: 1,
    items: [
        {
            lineTotal: 100,
            missingQuantity: 0,
            pickedQuantity: 1,
            pickingStatus: 'picked',
            productId: 'product-1',
            productName: 'Milk',
            quantity: 1,
            storeProductId: 'store-product-1',
            unitPrice: 100,
            variantId: 'variant-1',
        },
    ],
    orderId: 'order-1',
    orderNumber: 'ORD-1',
    orderStatus: 'accepted',
    packingStatus: null,
    paymentId: 'payment-1',
    paymentStatus: 'paid',
    pickerStatus: null,
    placedAt: '2026-05-21T00:00:00.000Z',
    readyForPickupAt: null,
    refundReviewRequired: false,
    rejectedAt: null,
    rejectionReason: null,
    slaBreachedStage: null,
    slaStatus: null,
    storeId: 'store-1',
    storeStatus: 'accepted',
    subtotal: 100,
    taxAmount: 0,
    timeline: [],
    updatedAt: '2026-05-21T00:00:00.000Z',
    ...override,
});
(0, node_test_1.test)('vendor incoming orders require orders read visibility', () => {
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canReadVendorOrders)(['orders:read']), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canReadVendorOrders)(['vendor:read_store']), false);
});
(0, node_test_1.test)('vendor incoming order actions require orders update visibility', () => {
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canUpdateVendorOrders)(['orders:read']), false);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canUpdateVendorOrders)(['orders:update']), true);
});
(0, node_test_1.test)('vendor active orders reuse order read and update permissions', () => {
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canReadVendorActiveOrders)(['orders:read']), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canReadVendorActiveOrders)(['orders:update']), false);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canUpdateVendorPickingPacking)(['orders:update']), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canUpdateVendorPickingPacking)(['orders:read']), false);
});
(0, node_test_1.test)('picking action visibility requires permission plus matching workflow state', () => {
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canShowStartPickingAction)(['orders:update'], orderForPermissions({
        orderStatus: 'accepted',
        pickerStatus: null,
    })), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canShowStartPickingAction)(['orders:read'], orderForPermissions({
        orderStatus: 'accepted',
        pickerStatus: null,
    })), false);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canShowCompletePickingAction)(['orders:update'], orderForPermissions({
        orderStatus: 'picking',
        pickerStatus: 'in_progress',
    })), true);
});
(0, node_test_1.test)('vendor order history uses read permission and cancellation uses update permission', () => {
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canReadVendorOrderHistory)(['orders:read']), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canReadVendorOrderHistory)(['orders:update']), false);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canUpdateVendorOrderHistory)(['orders:update']), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canUpdateVendorOrderHistory)(['orders:read']), false);
});
(0, node_test_1.test)('store cancellation visibility requires permission plus cancellable state', () => {
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canShowStoreCancellationAction)(['orders:update'], orderForPermissions({
        orderStatus: 'accepted',
    })), true);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canShowStoreCancellationAction)(['orders:read'], orderForPermissions({
        orderStatus: 'accepted',
    })), false);
    strict_1.default.equal((0, vendor_orders_permissions_util_1.canShowStoreCancellationAction)(['orders:update'], orderForPermissions({
        orderStatus: 'ready_for_pickup',
        packingStatus: 'ready_for_pickup',
    })), false);
});
