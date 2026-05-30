"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAdminRealtimeOrderEventToList = void 0;
const applyAdminRealtimeOrderEventToList = (orders, event, shouldIncludeOrder = () => true) => {
    if (!event?.order) {
        return orders;
    }
    const withoutExistingOrder = orders.filter((order) => order.orderId !== event.order?.orderId);
    if (!shouldIncludeOrder(event.order)) {
        return withoutExistingOrder;
    }
    return [event.order, ...withoutExistingOrder];
};
exports.applyAdminRealtimeOrderEventToList = applyAdminRealtimeOrderEventToList;
