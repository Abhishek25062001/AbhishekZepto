"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const vendor_realtime_stale_event_util_1 = require("../utils/vendor-realtime-stale-event.util");
(0, node_test_1.test)('detects vendor realtime events older than the latest accepted timestamp', () => {
    strict_1.default.equal((0, vendor_realtime_stale_event_util_1.isVendorRealtimeEventStale)('2026-01-01T09:59:59.000Z', '2026-01-01T10:00:00.000Z'), true);
    strict_1.default.equal((0, vendor_realtime_stale_event_util_1.isVendorRealtimeEventStale)('2026-01-01T10:00:00.000Z', '2026-01-01T10:00:00.000Z'), false);
});
(0, node_test_1.test)('ignores stale order events for the same order only', () => {
    strict_1.default.equal((0, vendor_realtime_stale_event_util_1.shouldIgnoreVendorOrderRealtimeEvent)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'accepted',
        totalAmount: 120,
        itemCount: 2,
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    }, {
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'picking',
        totalAmount: 120,
        itemCount: 2,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    }), true);
});
(0, node_test_1.test)('ignores stale pickup events for the same order only', () => {
    strict_1.default.equal((0, vendor_realtime_stale_event_util_1.shouldIgnoreVendorPickupRealtimeEvent)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupStatus: 'arrived_at_store',
        arrivedAt: '2026-01-01T09:59:59.000Z',
        pickupCompletedAt: null,
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
    }, {
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
    }), true);
});
