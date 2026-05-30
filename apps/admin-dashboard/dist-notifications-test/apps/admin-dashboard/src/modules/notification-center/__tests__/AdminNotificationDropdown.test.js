"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const notification_center_store_1 = require("../store/notification-center.store");
const notification_routing_util_1 = require("../utils/notification-routing.util");
const createNotification = (notificationType, dataPayload) => ({
    id: `${notificationType}-1`,
    notificationType,
    title: 'Admin notification',
    message: 'Control tower update',
    dataPayload,
    priority: 'critical',
    isRead: false,
    readAt: null,
    createdAt: '2026-05-30T10:00:00.000Z',
});
(0, node_test_1.test)('admin notification dropdown routes SLA and delivery updates', () => {
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('sla_alert', { orderId: 'order-1' })), '/realtime-control-tower');
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('delivery_update', { deliveryId: 'delivery-1' })), '/deliveries/delivery-1');
});
(0, node_test_1.test)('admin notification dropdown prepends realtime critical notification and unread count', () => {
    notification_center_store_1.useNotificationCenterStore.getState().clearNotificationState();
    notification_center_store_1.useNotificationCenterStore
        .getState()
        .prependNotification(createNotification('sla_alert', { orderId: 'order-1' }));
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().notifications[0]?.priority, 'critical');
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().unreadCount, 1);
});
