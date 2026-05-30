"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_realtime_stale_event_util_1 = require("../utils/delivery-realtime-stale-event.util");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
(0, node_test_1.test)('detects realtime events older than the latest accepted timestamp', () => {
    strict_1.default.equal((0, delivery_realtime_stale_event_util_1.isDeliveryRealtimeEventStale)('2026-01-01T09:59:59.000Z', '2026-01-01T10:00:00.000Z'), true);
    strict_1.default.equal((0, delivery_realtime_stale_event_util_1.isDeliveryRealtimeEventStale)('2026-01-01T10:00:01.000Z', '2026-01-01T10:00:00.000Z'), false);
});
(0, node_test_1.test)('ignores stale assignment events for the same assignment only', () => {
    strict_1.default.equal((0, delivery_realtime_stale_event_util_1.shouldIgnoreAssignmentRealtimeEvent)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        assignmentCode: null,
        pickupEta: null,
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
    }, {
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        assignmentCode: null,
        pickupEta: null,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
    }), true);
});
(0, node_test_1.test)('ignores stale status events for the same assignment only', () => {
    strict_1.default.equal((0, delivery_realtime_stale_event_util_1.shouldIgnoreStatusRealtimeEvent)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'picked_up',
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
        rejectionReason: null,
    }, {
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'en_route_to_customer',
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        rejectionReason: null,
    }), true);
});
