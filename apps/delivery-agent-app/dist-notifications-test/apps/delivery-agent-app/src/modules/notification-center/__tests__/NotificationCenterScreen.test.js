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
    title: 'Assignment updated',
    message: 'Assignment status changed',
    dataPayload,
    priority: 'normal',
    isRead: false,
    readAt: null,
    createdAt: '2026-05-30T10:00:00.000Z',
});
(0, node_test_1.test)('delivery notification center routes assignment updates', () => {
    strict_1.default.equal((0, notification_routing_util_1.getNotificationTarget)(createNotification('assignment_update', { assignmentId: 'assignment-1' })), 'assignment:assignment-1');
});
(0, node_test_1.test)('delivery notification center marks a tapped notification read', () => {
    notification_center_store_1.useNotificationCenterStore.getState().clearNotificationState();
    notification_center_store_1.useNotificationCenterStore
        .getState()
        .setNotifications([
        createNotification('assignment_update', { assignmentId: 'assignment-1' }),
    ]);
    notification_center_store_1.useNotificationCenterStore.getState().setUnreadCount(1);
    notification_center_store_1.useNotificationCenterStore.getState().markNotificationRead('assignment_update-1');
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().notifications[0]?.isRead, true);
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().unreadCount, 0);
});
