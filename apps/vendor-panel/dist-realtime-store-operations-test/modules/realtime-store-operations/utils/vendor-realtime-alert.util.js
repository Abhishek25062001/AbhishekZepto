"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRiderArrivedAlertViewModel = exports.getNewOrderRealtimeAlertViewModel = void 0;
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const formatTime = (timestamp) => timestamp ? new Date(timestamp).toLocaleTimeString() : 'Time pending';
const getNewOrderRealtimeAlertViewModel = (event) => {
    if (!event || event.eventName !== vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED) {
        return null;
    }
    return {
        orderId: event.orderId,
        totalAmountLabel: `₹${event.totalAmount.toFixed(2)}`,
        itemCountLabel: `${event.itemCount} items`,
        createdTimeLabel: formatTime(event.updatedAt),
        targetPath: `/orders/${event.orderId}`,
    };
};
exports.getNewOrderRealtimeAlertViewModel = getNewOrderRealtimeAlertViewModel;
const getRiderArrivedAlertViewModel = (event) => {
    if (!event || event.eventName !== vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED) {
        return null;
    }
    return {
        orderId: event.orderId,
        assignmentId: event.assignmentId,
        riderId: event.riderId,
        arrivedTimeLabel: event.arrivedAt
            ? formatTime(event.arrivedAt)
            : 'Arrival time pending',
        targetPath: `/orders/active/${event.orderId}`,
    };
};
exports.getRiderArrivedAlertViewModel = getRiderArrivedAlertViewModel;
