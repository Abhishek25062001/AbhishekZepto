"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationTarget = void 0;
const getNotificationTarget = (notification) => {
    if (notification.notificationType === 'order_update') {
        return typeof notification.dataPayload.orderId === 'string'
            ? `order:${notification.dataPayload.orderId}`
            : 'orders';
    }
    if (notification.notificationType === 'delivery_update') {
        return typeof notification.dataPayload.orderId === 'string'
            ? `tracking:${notification.dataPayload.orderId}`
            : 'tracking';
    }
    return null;
};
exports.getNotificationTarget = getNotificationTarget;
