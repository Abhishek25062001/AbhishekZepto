"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const realtime_order_types_1 = require("../types/realtime-order.types");
const realtime_delivery_location_util_1 = require("../utils/realtime-delivery-location.util");
(0, node_test_1.test)('valid coordinates are accepted', () => {
    strict_1.default.equal((0, realtime_delivery_location_util_1.hasValidRealtimeCoordinates)(28.6139, 77.209), true);
});
(0, node_test_1.test)('stale location update is identified', () => {
    strict_1.default.equal((0, realtime_delivery_location_util_1.isLocationEventStale)('2026-05-30T01:00:00.000Z', '2026-05-30T01:01:00.000Z'), true);
});
(0, node_test_1.test)('malformed coordinates are ignored for location events', () => {
    const event = (0, realtime_delivery_location_util_1.mapRealtimeDeliveryTrackingPayload)({
        emittedAt: '2026-05-30T01:00:00.000Z',
        data: {
            orderId: 'order-1',
            assignmentId: 'assignment-1',
            deliveryAgentId: 'agent-1',
            currentLatitude: 999,
            currentLongitude: 77.209,
        },
    }, realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    strict_1.default.equal(event, null);
});
