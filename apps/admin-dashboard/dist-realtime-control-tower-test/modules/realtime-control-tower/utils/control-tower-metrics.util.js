"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAdminRealtimeEventsToMetrics = exports.EMPTY_CONTROL_TOWER_METRICS = void 0;
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
exports.EMPTY_CONTROL_TOWER_METRICS = {
    activeOrdersCount: 0,
    assignedRidersCount: 0,
    outForDeliveryCount: 0,
    delayedOrdersCount: 0,
    openSlaBreachesCount: 0,
};
const applyAdminRealtimeEventsToMetrics = (metrics, orderEvent, deliveryEvent, slaEvent) => {
    const next = { ...metrics };
    if (orderEvent?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED) {
        next.activeOrdersCount += 1;
    }
    if (orderEvent?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_DELAYED) {
        next.delayedOrdersCount += 1;
    }
    if (orderEvent?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CANCELLED &&
        next.activeOrdersCount > 0) {
        next.activeOrdersCount -= 1;
    }
    if (deliveryEvent?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED) {
        next.assignedRidersCount += 1;
    }
    if (deliveryEvent &&
        ['en_route_to_customer', 'arrived_at_customer'].includes(deliveryEvent.deliveryStatus)) {
        next.outForDeliveryCount += 1;
    }
    if (slaEvent?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED) {
        next.openSlaBreachesCount += 1;
    }
    return next;
};
exports.applyAdminRealtimeEventsToMetrics = applyAdminRealtimeEventsToMetrics;
