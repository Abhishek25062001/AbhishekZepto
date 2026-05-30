"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationTarget = void 0;
const getNotificationTarget = (notification) => {
    if (notification.notificationType === 'order_update') {
        return typeof notification.dataPayload.orderId === 'string'
            ? `/orders/active/${notification.dataPayload.orderId}`
            : '/orders/active';
    }
    if (notification.notificationType === 'delivery_update') {
        return typeof notification.dataPayload.orderId === 'string'
            ? `/orders/active/${notification.dataPayload.orderId}`
            : '/orders/active';
    }
    return null;
};
exports.getNotificationTarget = getNotificationTarget;
