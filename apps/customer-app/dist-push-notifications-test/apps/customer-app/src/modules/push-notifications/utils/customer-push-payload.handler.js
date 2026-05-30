"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomerPushPayload = void 0;
const getOrderId = (payload) => typeof payload.orderId === 'string' && payload.orderId.trim()
    ? payload.orderId.trim()
    : null;
const handleCustomerPushPayload = (payload, navigation) => {
    const orderId = getOrderId(payload);
    if (payload.type === 'order_out_for_delivery' && orderId) {
        navigation.navigate('DeliveryTracking', { orderId });
        return true;
    }
    if (payload.type === 'order_delivered' && orderId) {
        navigation.navigate('OrderDetail', { orderId });
        return true;
    }
    if (payload.type === 'delivery_failed' && orderId) {
        navigation.navigate('OrderDetail', { orderId });
        return true;
    }
    return false;
};
exports.handleCustomerPushPayload = handleCustomerPushPayload;
