"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const admin_realtime_store_1 = require("../store/admin-realtime.store");
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
(0, node_test_1.default)('admin realtime store tracks socket state and city rooms', () => {
    admin_realtime_store_1.useAdminRealtimeStore.getState().clearAdminRealtimeState();
    admin_realtime_store_1.useAdminRealtimeStore.getState().setConnectionState('connected');
    admin_realtime_store_1.useAdminRealtimeStore.getState().setSocketConnected(true);
    admin_realtime_store_1.useAdminRealtimeStore.getState().addCityRoom('city-1');
    admin_realtime_store_1.useAdminRealtimeStore.getState().addCityRoom('city-1');
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().socketConnected, true);
    strict_1.default.deepEqual(admin_realtime_store_1.useAdminRealtimeStore.getState().activeCityRooms, ['city-1']);
    admin_realtime_store_1.useAdminRealtimeStore.getState().removeCityRoom('city-1');
    strict_1.default.deepEqual(admin_realtime_store_1.useAdminRealtimeStore.getState().activeCityRooms, []);
});
(0, node_test_1.default)('admin realtime store records latest order delivery and sla events', () => {
    admin_realtime_store_1.useAdminRealtimeStore.getState().clearAdminRealtimeState();
    const now = new Date('2026-05-30T00:00:00.000Z').toISOString();
    admin_realtime_store_1.useAdminRealtimeStore.getState().setLastOrderEvent({
        cityId: 'city-1',
        emittedAt: now,
        eventId: 'event-order-1',
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED,
        order: null,
        orderId: 'order-1',
        orderStatus: 'placed',
        paymentStatus: 'paid',
        updatedAt: now,
    });
    admin_realtime_store_1.useAdminRealtimeStore.getState().setLastDeliveryEvent({
        cityId: 'city-1',
        delivery: null,
        deliveryAgentId: 'agent-1',
        deliveryId: 'delivery-1',
        deliveryStatus: 'assigned',
        emittedAt: now,
        eventId: 'event-delivery-1',
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
        orderId: 'order-1',
        updatedAt: now,
    });
    admin_realtime_store_1.useAdminRealtimeStore.getState().setLastSlaEvent({
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
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastOrderEvent?.orderId, 'order-1');
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastDeliveryEvent?.deliveryId, 'delivery-1');
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastSlaEvent?.breachId, 'breach-1');
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastRealtimeEventAt, now);
});
