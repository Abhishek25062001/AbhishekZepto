"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const admin_realtime_event_mapper_1 = require("../utils/admin-realtime-event.mapper");
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
const emittedAt = '2026-05-30T00:00:00.000Z';
(0, node_test_1.default)('maps admin order realtime payloads into live order events', () => {
    const event = (0, admin_realtime_event_mapper_1.mapAdminRealtimeEventPayload)({
        emittedAt,
        data: {
            cityId: 'city-1',
            customerId: 'customer-1',
            grandTotal: 199,
            itemCount: 3,
            orderId: 'order-1',
            orderNumber: 'ORD-1',
            orderStatus: 'placed',
            storeId: 'store-1',
            updatedAt: emittedAt,
        },
    }, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED);
    strict_1.default.equal(event?.eventName, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED);
    strict_1.default.equal(event?.orderId, 'order-1');
    strict_1.default.equal(event?.order?.grandTotal, 199);
});
(0, node_test_1.default)('maps admin delivery realtime payloads into delivery events', () => {
    const event = (0, admin_realtime_event_mapper_1.mapAdminRealtimeEventPayload)({
        emittedAt,
        data: {
            currentLatitude: '12.91',
            currentLongitude: '77.64',
            deliveryAgentId: 'agent-1',
            deliveryId: 'delivery-1',
            deliveryStatus: 'en_route_to_customer',
            orderId: 'order-1',
            updatedAt: emittedAt,
        },
    }, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    strict_1.default.equal(event?.eventName, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    strict_1.default.equal(event?.deliveryId, 'delivery-1');
    strict_1.default.equal(event?.delivery?.latitude, 12.91);
});
(0, node_test_1.default)('maps admin sla breach payloads into sla events', () => {
    const event = (0, admin_realtime_event_mapper_1.mapAdminRealtimeEventPayload)({
        emittedAt,
        data: {
            assignmentId: 'assignment-1',
            breachedAt: emittedAt,
            breachId: 'breach-1',
            breachType: 'delivery_sla',
            escalationLevel: 'level_1',
            orderId: 'order-1',
        },
    }, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED);
    strict_1.default.equal(event?.eventName, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED);
    strict_1.default.equal(event?.breachId, 'breach-1');
});
