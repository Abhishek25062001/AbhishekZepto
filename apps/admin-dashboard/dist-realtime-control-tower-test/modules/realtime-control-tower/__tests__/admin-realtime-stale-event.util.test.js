"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
const admin_realtime_stale_event_util_1 = require("../utils/admin-realtime-stale-event.util");
(0, node_test_1.default)('ignores stale order events for the same order', () => {
    const latest = {
        cityId: 'city-1',
        emittedAt: null,
        eventId: null,
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        order: null,
        orderId: 'order-1',
        orderStatus: 'accepted',
        paymentStatus: 'paid',
        updatedAt: '2026-05-30T01:00:00.000Z',
    };
    const incoming = {
        ...latest,
        orderStatus: 'placed',
        updatedAt: '2026-05-30T00:00:00.000Z',
    };
    strict_1.default.equal((0, admin_realtime_stale_event_util_1.shouldIgnoreAdminOrderRealtimeEvent)(incoming, latest), true);
});
(0, node_test_1.default)('does not ignore newer delivery events', () => {
    const latest = {
        cityId: 'city-1',
        delivery: null,
        deliveryAgentId: 'agent-1',
        deliveryId: 'delivery-1',
        deliveryStatus: 'assigned',
        emittedAt: null,
        eventId: null,
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED,
        orderId: 'order-1',
        updatedAt: '2026-05-30T00:00:00.000Z',
    };
    const incoming = {
        ...latest,
        deliveryStatus: 'picked_up',
        updatedAt: '2026-05-30T01:00:00.000Z',
    };
    strict_1.default.equal((0, admin_realtime_stale_event_util_1.shouldIgnoreAdminDeliveryRealtimeEvent)(incoming, latest), false);
});
(0, node_test_1.default)('ignores duplicate sla breach events', () => {
    const latest = {
        assignmentId: 'assignment-1',
        breachId: 'breach-1',
        breachedAt: '2026-05-30T00:00:00.000Z',
        breachType: 'delivery_sla',
        cityId: 'city-1',
        deliveryId: 'delivery-1',
        emittedAt: null,
        escalationLevel: null,
        eventId: null,
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
        orderId: 'order-1',
    };
    strict_1.default.equal((0, admin_realtime_stale_event_util_1.shouldIgnoreAdminSlaRealtimeEvent)(latest, latest), true);
});
