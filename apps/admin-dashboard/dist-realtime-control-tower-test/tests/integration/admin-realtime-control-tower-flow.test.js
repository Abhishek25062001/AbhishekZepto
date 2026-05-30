"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const admin_realtime_store_1 = require("../../modules/realtime-control-tower/store/admin-realtime.store");
const control_tower_realtime_types_1 = require("../../modules/realtime-control-tower/types/control-tower-realtime.types");
const control_tower_metrics_util_1 = require("../../modules/realtime-control-tower/utils/control-tower-metrics.util");
const admin_realtime_event_handler_util_1 = require("../../modules/realtime-control-tower/utils/admin-realtime-event-handler.util");
const live_delivery_locations_util_1 = require("../../modules/realtime-control-tower/utils/live-delivery-locations.util");
const live_orders_util_1 = require("../../modules/realtime-control-tower/utils/live-orders.util");
const live_sla_breaches_util_1 = require("../../modules/realtime-control-tower/utils/live-sla-breaches.util");
const now = '2026-05-30T00:00:00.000Z';
(0, node_test_1.default)('admin realtime control tower flow applies socket payloads to live view state', () => {
    admin_realtime_store_1.useAdminRealtimeStore.getState().clearAdminRealtimeState();
    (0, admin_realtime_event_handler_util_1.handleAdminRealtimePayload)({
        emittedAt: now,
        data: {
            cityId: 'city-1',
            customerId: 'customer-1',
            grandTotal: 250,
            itemCount: 2,
            orderId: 'order-1',
            orderNumber: 'ORD-1',
            orderStatus: 'placed',
            storeId: 'store-1',
            updatedAt: now,
        },
    }, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED);
    const orderEvent = admin_realtime_store_1.useAdminRealtimeStore.getState().lastOrderEvent;
    const orders = (0, live_orders_util_1.applyAdminRealtimeOrderEventToList)([], orderEvent);
    const orderMetrics = (0, control_tower_metrics_util_1.applyAdminRealtimeEventsToMetrics)({
        activeOrdersCount: 0,
        assignedRidersCount: 0,
        delayedOrdersCount: 0,
        openSlaBreachesCount: 0,
        outForDeliveryCount: 0,
    }, orderEvent, null, null);
    strict_1.default.equal(orders.length, 1);
    strict_1.default.equal(orderMetrics.activeOrdersCount, 1);
    (0, admin_realtime_event_handler_util_1.handleAdminRealtimePayload)({
        emittedAt: now,
        data: {
            cityId: 'city-1',
            currentLatitude: 12.91,
            currentLongitude: 77.64,
            deliveryAgentId: 'agent-1',
            deliveryId: 'delivery-1',
            deliveryStatus: 'en_route_to_customer',
            orderId: 'order-1',
            updatedAt: '2026-05-30T00:01:00.000Z',
        },
    }, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    const deliveryEvent = admin_realtime_store_1.useAdminRealtimeStore.getState().lastDeliveryEvent;
    const deliveries = (0, live_delivery_locations_util_1.applyAdminRealtimeDeliveryEventToLocations)([], deliveryEvent);
    strict_1.default.equal(deliveries.length, 1);
    strict_1.default.equal(deliveries[0]?.latitude, 12.91);
    (0, admin_realtime_event_handler_util_1.handleAdminRealtimePayload)({
        emittedAt: now,
        data: {
            assignmentId: 'delivery-1',
            breachedAt: '2026-05-30T00:02:00.000Z',
            breachId: 'breach-1',
            breachType: 'delivery_sla',
            cityId: 'city-1',
            deliveryId: 'delivery-1',
            escalationLevel: 'level_1',
            orderId: 'order-1',
        },
    }, control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED);
    const slaEvent = admin_realtime_store_1.useAdminRealtimeStore.getState().lastSlaEvent;
    const breaches = (0, live_sla_breaches_util_1.applyAdminRealtimeSlaEventToList)([], slaEvent);
    const finalMetrics = (0, control_tower_metrics_util_1.applyAdminRealtimeEventsToMetrics)(orderMetrics, null, deliveryEvent, slaEvent);
    strict_1.default.equal(breaches.length, 1);
    strict_1.default.equal(finalMetrics.outForDeliveryCount, 1);
    strict_1.default.equal(finalMetrics.openSlaBreachesCount, 1);
});
