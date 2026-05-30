"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAdminRealtimePayload = void 0;
const admin_realtime_store_1 = require("../store/admin-realtime.store");
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
const admin_realtime_event_mapper_1 = require("./admin-realtime-event.mapper");
const admin_realtime_stale_event_util_1 = require("./admin-realtime-stale-event.util");
const isAdminOrderRealtimeEvent = (event) => event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_DELAYED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CANCELLED;
const isAdminDeliveryRealtimeEvent = (event) => event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED ||
    event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_FAILED;
const isAdminSlaRealtimeEvent = (event) => event?.eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED;
const handleAdminRealtimePayload = (payload, eventName) => {
    const event = (0, admin_realtime_event_mapper_1.mapAdminRealtimeEventPayload)(payload, eventName);
    if (!event) {
        return;
    }
    if (isAdminOrderRealtimeEvent(event)) {
        if ((0, admin_realtime_stale_event_util_1.shouldIgnoreAdminOrderRealtimeEvent)(event, admin_realtime_store_1.useAdminRealtimeStore.getState().lastOrderEvent)) {
            return;
        }
        admin_realtime_store_1.useAdminRealtimeStore.getState().setLastOrderEvent(event);
        return;
    }
    if (isAdminDeliveryRealtimeEvent(event)) {
        if ((0, admin_realtime_stale_event_util_1.shouldIgnoreAdminDeliveryRealtimeEvent)(event, admin_realtime_store_1.useAdminRealtimeStore.getState().lastDeliveryEvent)) {
            return;
        }
        admin_realtime_store_1.useAdminRealtimeStore.getState().setLastDeliveryEvent(event);
        return;
    }
    if (isAdminSlaRealtimeEvent(event)) {
        if ((0, admin_realtime_stale_event_util_1.shouldIgnoreAdminSlaRealtimeEvent)(event, admin_realtime_store_1.useAdminRealtimeStore.getState().lastSlaEvent)) {
            return;
        }
        admin_realtime_store_1.useAdminRealtimeStore.getState().setLastSlaEvent(event);
    }
};
exports.handleAdminRealtimePayload = handleAdminRealtimePayload;
