"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVendorRealtimePayload = void 0;
const vendor_realtime_store_1 = require("../store/vendor-realtime.store");
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const vendor_realtime_event_mapper_1 = require("./vendor-realtime-event.mapper");
const vendor_realtime_stale_event_util_1 = require("./vendor-realtime-stale-event.util");
const isOrderRealtimeEvent = (event) => event?.eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED ||
    event?.eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED ||
    event?.eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CANCELLED;
const isPickupRealtimeEvent = (event) => Boolean(event) && !isOrderRealtimeEvent(event);
const handleVendorRealtimePayload = (payload, eventName) => {
    const event = (0, vendor_realtime_event_mapper_1.mapVendorRealtimeEventPayload)(payload, eventName);
    if (!event) {
        return;
    }
    if (isOrderRealtimeEvent(event)) {
        if ((0, vendor_realtime_stale_event_util_1.shouldIgnoreVendorOrderRealtimeEvent)(event, vendor_realtime_store_1.useVendorRealtimeStore.getState().lastOrderEvent)) {
            return;
        }
        vendor_realtime_store_1.useVendorRealtimeStore.getState().setLastOrderEvent(event);
        return;
    }
    if (isPickupRealtimeEvent(event)) {
        if ((0, vendor_realtime_stale_event_util_1.shouldIgnoreVendorPickupRealtimeEvent)(event, vendor_realtime_store_1.useVendorRealtimeStore.getState().lastPickupEvent)) {
            return;
        }
        vendor_realtime_store_1.useVendorRealtimeStore.getState().setLastPickupEvent(event);
    }
};
exports.handleVendorRealtimePayload = handleVendorRealtimePayload;
