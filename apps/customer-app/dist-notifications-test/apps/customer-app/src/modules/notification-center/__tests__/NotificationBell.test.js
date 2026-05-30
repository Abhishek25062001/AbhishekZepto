"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const notification_center_store_1 = require("../store/notification-center.store");
(0, node_test_1.test)('customer notification bell store exposes unread badge count', () => {
    notification_center_store_1.useNotificationCenterStore.getState().clearNotificationState();
    notification_center_store_1.useNotificationCenterStore.getState().setUnreadCount(3);
    strict_1.default.equal(notification_center_store_1.useNotificationCenterStore.getState().unreadCount, 3);
});
