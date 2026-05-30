"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_realtime_event_mapper_1 = require("../utils/delivery-realtime-event.mapper");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
(0, node_test_1.test)('maps assignment created payload with deliveryId fallback', () => {
    const event = (0, delivery_realtime_event_mapper_1.mapDeliveryRealtimeEventPayload)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        emittedAt: '2026-01-01T10:00:01.000Z',
        data: {
            deliveryId: 'assignment-1',
            orderId: 'order-1',
            assignmentStatus: 'assigned',
            assignmentCode: 'DEL-100',
            pickupEta: '2026-01-01T10:15:00.000Z',
            updatedAt: '2026-01-01T10:00:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED);
    strict_1.default.equal(event?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED);
    strict_1.default.equal(event?.assignmentId, 'assignment-1');
    strict_1.default.equal(event?.deliveryStatus, 'assigned');
});
(0, node_test_1.test)('maps rejected location sync status event with rejection reason', () => {
    const event = (0, delivery_realtime_event_mapper_1.mapDeliveryRealtimeEventPayload)({
        data: {
            assignmentId: 'assignment-1',
            orderId: 'order-1',
            status: 'en_route_to_customer',
            rejectionReason: 'location too old',
            lastLocationUpdatedAt: '2026-01-01T10:00:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED);
    strict_1.default.equal(event?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED);
    strict_1.default.equal(event?.assignmentId, 'assignment-1');
    strict_1.default.equal(event?.deliveryStatus, 'en_route_to_customer');
    strict_1.default.equal(event && 'rejectionReason' in event ? event.rejectionReason : null, 'location too old');
});
(0, node_test_1.test)('returns null for malformed realtime payloads', () => {
    const event = (0, delivery_realtime_event_mapper_1.mapDeliveryRealtimeEventPayload)({
        data: {
            assignmentId: '',
            orderId: 'order-1',
            deliveryStatus: 'assigned',
            updatedAt: '2026-01-01T10:00:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED);
    strict_1.default.equal(event, null);
});
