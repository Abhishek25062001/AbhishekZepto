"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
const control_tower_metrics_util_1 = require("../utils/control-tower-metrics.util");
const now = '2026-05-30T00:00:00.000Z';
(0, node_test_1.default)('control tower metrics reflect latest order delivery and sla events', () => {
    const metrics = (0, control_tower_metrics_util_1.applyAdminRealtimeEventsToMetrics)(control_tower_metrics_util_1.EMPTY_CONTROL_TOWER_METRICS, {
        cityId: 'city-1',
        emittedAt: now,
        eventId: 'event-order-1',
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED,
        order: null,
        orderId: 'order-1',
        orderStatus: 'placed',
        paymentStatus: 'paid',
        updatedAt: now,
    }, {
        cityId: 'city-1',
        delivery: null,
        deliveryAgentId: 'agent-1',
        deliveryId: 'delivery-1',
        deliveryStatus: 'en_route_to_customer',
        emittedAt: now,
        eventId: 'event-delivery-1',
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
        orderId: 'order-1',
        updatedAt: now,
    }, {
        assignmentId: 'delivery-1',
        breachId: 'breach-1',
        breachedAt: now,
        breachType: 'delivery_sla',
        cityId: 'city-1',
        deliveryId: 'delivery-1',
        emittedAt: now,
        escalationLevel: 'level_1',
        eventId: 'event-sla-1',
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
        orderId: 'order-1',
    });
    strict_1.default.equal(metrics.activeOrdersCount, 1);
    strict_1.default.equal(metrics.assignedRidersCount, 1);
    strict_1.default.equal(metrics.outForDeliveryCount, 1);
    strict_1.default.equal(metrics.openSlaBreachesCount, 1);
});
