"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationTarget = void 0;
const getNotificationTarget = (notification) => {
    if (notification.notificationType === 'sla_alert') {
        return '/realtime-control-tower';
    }
    if (notification.notificationType === 'order_update') {
        return typeof notification.dataPayload.orderId === 'string'
            ? `/orders/${notification.dataPayload.orderId}`
            : '/orders';
    }
    if (notification.notificationType === 'delivery_update') {
        return typeof notification.dataPayload.deliveryId === 'string'
            ? `/deliveries/${notification.dataPayload.deliveryId}`
            : '/deliveries';
    }
    return null;
};
exports.getNotificationTarget = getNotificationTarget;
