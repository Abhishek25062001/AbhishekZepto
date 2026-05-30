"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const vendor_realtime_alert_util_1 = require("../utils/vendor-realtime-alert.util");
(0, node_test_1.test)('new order realtime alert builds view model from order created event', () => {
    const viewModel = (0, vendor_realtime_alert_util_1.getNewOrderRealtimeAlertViewModel)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'placed',
        totalAmount: 125.5,
        itemCount: 4,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    });
    strict_1.default.equal(viewModel?.orderId, 'order-1');
    strict_1.default.equal(viewModel?.totalAmountLabel, '₹125.50');
    strict_1.default.equal(viewModel?.itemCountLabel, '4 items');
    strict_1.default.equal(viewModel?.targetPath, '/orders/order-1');
});
(0, node_test_1.test)('new order realtime alert hides for status update events', () => {
    const viewModel = (0, vendor_realtime_alert_util_1.getNewOrderRealtimeAlertViewModel)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'accepted',
        totalAmount: 125.5,
        itemCount: 4,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    });
    strict_1.default.equal(viewModel, null);
});
