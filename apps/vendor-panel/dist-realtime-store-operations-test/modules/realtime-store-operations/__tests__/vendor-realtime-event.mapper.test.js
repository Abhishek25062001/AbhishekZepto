"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const vendor_realtime_event_mapper_1 = require("../utils/vendor-realtime-event.mapper");
(0, node_test_1.test)('maps order created event to vendor order row model', () => {
    const event = (0, vendor_realtime_event_mapper_1.mapVendorRealtimeEventPayload)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED,
        emittedAt: '2026-01-01T10:00:01.000Z',
        data: {
            orderId: 'order-1',
            orderNumber: 'ORD-1',
            storeId: 'store-1',
            customerId: 'customer-1',
            orderStatus: 'placed',
            storeStatus: 'pending_acceptance',
            totalAmount: 125.5,
            itemCount: 4,
            currency: 'INR',
            createdAt: '2026-01-01T10:00:00.000Z',
            updatedAt: '2026-01-01T10:00:00.000Z',
        },
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED);
    strict_1.default.equal(event?.eventName, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED);
    strict_1.default.equal(event && 'order' in event ? event.order?.orderNumber : null, 'ORD-1');
    strict_1.default.equal(event && 'order' in event ? event.order?.grandTotal : null, 125.5);
});
(0, node_test_1.test)('maps pickup completed event to pickup model', () => {
    const event = (0, vendor_realtime_event_mapper_1.mapVendorRealtimeEventPayload)({
        data: {
            orderId: 'order-1',
            assignmentId: 'assignment-1',
            riderId: 'rider-1',
            pickupCompletedAt: '2026-01-01T10:05:00.000Z',
        },
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED);
    strict_1.default.equal(event?.eventName, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED);
    strict_1.default.equal(event && 'pickupStatus' in event ? event.pickupStatus : null, 'pickup_completed');
    strict_1.default.equal(event && 'pickupCompletedAt' in event ? event.pickupCompletedAt : null, '2026-01-01T10:05:00.000Z');
});
(0, node_test_1.test)('ignores malformed vendor realtime payloads', () => {
    const event = (0, vendor_realtime_event_mapper_1.mapVendorRealtimeEventPayload)({
        data: {
            orderId: 'order-1',
            orderStatus: 'placed',
        },
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED);
    strict_1.default.equal(event, null);
});
