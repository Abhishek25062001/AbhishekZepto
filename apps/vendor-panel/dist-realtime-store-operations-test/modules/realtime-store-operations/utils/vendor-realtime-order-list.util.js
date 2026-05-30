"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyVendorRealtimeOrderEventToDetail = exports.applyVendorRealtimeOrderEventToList = void 0;
const applyVendorRealtimeOrderEventToList = (orders, event, shouldIncludeOrder) => {
    if (!event?.order) {
        return orders;
    }
    const nextOrder = event.order;
    const withoutExistingOrder = orders.filter((order) => order.orderId !== nextOrder.orderId);
    if (!shouldIncludeOrder(nextOrder)) {
        return withoutExistingOrder;
    }
    return [nextOrder, ...withoutExistingOrder];
};
exports.applyVendorRealtimeOrderEventToList = applyVendorRealtimeOrderEventToList;
const applyVendorRealtimeOrderEventToDetail = (order, event) => {
    if (!event?.order || event.orderId !== order.orderId) {
        return order;
    }
    return {
        ...order,
        acceptedAt: event.order.acceptedAt,
        createdAt: event.order.createdAt,
        grandTotal: event.order.grandTotal,
        itemCount: event.order.itemCount,
        orderStatus: event.order.orderStatus,
        packingStatus: event.order.packingStatus,
        pickerStatus: event.order.pickerStatus,
        placedAt: event.order.placedAt,
        slaBreachedStage: event.order.slaBreachedStage,
        slaStatus: event.order.slaStatus,
        storeStatus: event.order.storeStatus,
        updatedAt: event.updatedAt,
    };
};
exports.applyVendorRealtimeOrderEventToDetail = applyVendorRealtimeOrderEventToDetail;
