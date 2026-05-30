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
    title: 'Vendor notification',
    message: 'Store operation changed',
    dataPayload,
    priority: 'normal',
    isRead: false,
    readAt: null,
    createdAt: '2026-05-30T10:00:00.000Z',
});
(0, node_test_1.test)('vendor notification dropdown routes order and delivery updates to active order visibility', () => {
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('order_update', { orderId: 'order-1' })), '/orders/active/order-1');
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('delivery_update', { orderId: 'order-1' })), '/orders/active/order-1');
});
(0, node_test_1.test)('vendor notification dropdown mark all read clears unread badge state', () => {
    notification_center_store_1.useNotificationCenterStore.getState().clearNotificationState();
    notification_center_store_1.useNotificationCenterStore
        .getState()
        .setNotifications([createNotification('order_update', { orderId: 'order-1' })]);
    notification_center_store_1.useNotificationCenterStore.getState().setUnreadCount(1);
    notification_center_store_1.useNotificationCenterStore.getState().markAllRead();
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().notifications[0]?.isRead, true);
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().unreadCount, 0);
});
