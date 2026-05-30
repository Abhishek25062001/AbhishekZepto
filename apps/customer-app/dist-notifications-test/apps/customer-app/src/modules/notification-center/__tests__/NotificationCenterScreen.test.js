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
    title: 'Order updated',
    message: 'Order status changed',
    dataPayload,
    priority: 'normal',
    isRead: false,
    readAt: null,
    createdAt: '2026-05-30T10:00:00.000Z',
});
(0, node_test_1.test)('customer notification center routes order and delivery updates', () => {
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('order_update', { orderId: 'order-1' })), 'order:order-1');
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('delivery_update', { orderId: 'order-1' })), 'tracking:order-1');
});
(0, node_test_1.test)('customer notification center marks a tapped notification read', () => {
    notification_center_store_1.useNotificationCenterStore.getState().clearNotificationState();
    notification_center_store_1.useNotificationCenterStore
        .getState()
        .setNotifications([createNotification('order_update', { orderId: 'order-1' })]);
    notification_center_store_1.useNotificationCenterStore.getState().setUnreadCount(1);
    notification_center_store_1.useNotificationCenterStore.getState().markNotificationRead('order_update-1');
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().notifications[0]?.isRead, true);
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().unreadCount, 0);
});
