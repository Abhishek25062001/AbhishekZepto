"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const vendor_realtime_alert_util_1 = require("../utils/vendor-realtime-alert.util");
(0, node_test_1.test)('rider arrived alert builds view model from rider arrival event', () => {
    const viewModel = (0, vendor_realtime_alert_util_1.getRiderArrivedAlertViewModel)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupStatus: 'arrived_at_store',
        arrivedAt: '2026-01-01T10:00:00.000Z',
        pickupCompletedAt: null,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
    });
    strict_1.default.equal(viewModel?.orderId, 'order-1');
    strict_1.default.equal(viewModel?.assignmentId, 'assignment-1');
    strict_1.default.equal(viewModel?.riderId, 'rider-1');
    strict_1.default.equal(viewModel?.targetPath, '/orders/active/order-1');
});
(0, node_test_1.test)('rider arrived alert hides for pickup completion events', () => {
    const viewModel = (0, vendor_realtime_alert_util_1.getRiderArrivedAlertViewModel)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupStatus: 'pickup_completed',
        arrivedAt: null,
        pickupCompletedAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
    });
    strict_1.default.equal(viewModel, null);
});
