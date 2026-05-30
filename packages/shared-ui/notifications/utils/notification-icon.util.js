"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationIconName = void 0;
const NOTIFICATION_ICON_BY_TYPE = {
    assignment_update: 'clipboard-list',
    delivery_update: 'truck',
    order_update: 'shopping-bag',
    payment_update: 'credit-card',
    refund_update: 'rotate-ccw',
    sla_alert: 'timer-warning',
    system_alert: 'bell',
};
const getNotificationIconName = (notificationType) => NOTIFICATION_ICON_BY_TYPE[notificationType];
exports.getNotificationIconName = getNotificationIconName;
