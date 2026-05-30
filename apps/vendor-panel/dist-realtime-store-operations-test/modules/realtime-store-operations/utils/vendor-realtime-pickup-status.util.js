"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorRealtimePickupStatusForOrder = void 0;
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const getVendorRealtimePickupStatusForOrder = (event, orderId) => {
    if (!event || event.orderId !== orderId) {
        return null;
    }
    if (event.eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED) {
        return 'picked_up';
    }
    if (event.eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED) {
        return 'arrived_at_store';
    }
    return null;
};
exports.getVendorRealtimePickupStatusForOrder = getVendorRealtimePickupStatusForOrder;
