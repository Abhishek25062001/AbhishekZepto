"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const NotificationEmptyState_1 = require("./NotificationEmptyState");
const NotificationListItem_1 = require("./NotificationListItem");
const NotificationList = ({ notifications, onPressNotification, }) => {
    if (!notifications.length) {
        return (0, jsx_runtime_1.jsx)(NotificationEmptyState_1.NotificationEmptyState, {});
    }
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { children: notifications.map((notification) => ((0, jsx_runtime_1.jsx)(NotificationListItem_1.NotificationListItem, { notification: notification, onPress: onPressNotification }, notification.id))) }));
};
exports.NotificationList = NotificationList;
