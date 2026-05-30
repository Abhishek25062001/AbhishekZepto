"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_realtime_store_1 = require("../../modules/realtime-control-tower/store/admin-realtime.store");
const control_tower_realtime_types_1 = require("../../modules/realtime-control-tower/types/control-tower-realtime.types");
(0, node_test_1.test)('Phase 7 admin realtime tracks order delivery and SLA events', () => {
    admin_realtime_store_1.useAdminRealtimeStore.getState().clearAdminRealtimeState();
    admin_realtime_store_1.useAdminRealtimeStore.getState().setLastOrderEvent({
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED,
        orderId: 'order-1',
        cityId: 'city-1',
        orderStatus: 'placed',
        paymentStatus: 'paid',
        updatedAt: '2026-05-30T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    });
    admin_realtime_store_1.useAdminRealtimeStore.getState().setLastDeliveryEvent({
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
        deliveryId: 'delivery-1',
        orderId: 'order-1',
        cityId: 'city-1',
        deliveryAgentId: 'agent-1',
        deliveryStatus: 'en_route_to_customer',
        updatedAt: '2026-05-30T10:01:00.000Z',
        emittedAt: null,
        eventId: null,
        delivery: null,
    });
    admin_realtime_store_1.useAdminRealtimeStore.getState().setLastSlaEvent({
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
        breachId: 'breach-1',
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        deliveryId: 'delivery-1',
        cityId: 'city-1',
        breachType: 'delivery_delay',
        escalationLevel: 'level_1',
        breachedAt: '2026-05-30T10:02:00.000Z',
        emittedAt: null,
        eventId: null,
    });
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastOrderEvent?.orderId, 'order-1');
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastDeliveryEvent?.deliveryId, 'delivery-1');
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().lastSlaEvent?.breachId, 'breach-1');
});
(0, node_test_1.test)('Phase 7 admin realtime keeps city rooms for reconnect fallback', () => {
    admin_realtime_store_1.useAdminRealtimeStore.getState().clearAdminRealtimeState();
    admin_realtime_store_1.useAdminRealtimeStore.getState().addCityRoom('city-1');
    admin_realtime_store_1.useAdminRealtimeStore.getState().setSocketConnected(false);
    strict_1.default.deepEqual(admin_realtime_store_1.useAdminRealtimeStore.getState().activeCityRooms, ['city-1']);
    strict_1.default.equal(admin_realtime_store_1.useAdminRealtimeStore.getState().connectionState, 'disconnected');
});
