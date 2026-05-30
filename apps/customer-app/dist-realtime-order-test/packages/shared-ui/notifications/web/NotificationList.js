"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const NotificationEmptyState_1 = require("./NotificationEmptyState");
const NotificationListItem_1 = require("./NotificationListItem");
const NotificationList = ({ notifications, onClickNotification, }) => {
    if (!notifications.length) {
        return (0, jsx_runtime_1.jsx)(NotificationEmptyState_1.NotificationEmptyState, {});
    }
    return ((0, jsx_runtime_1.jsx)("ul", { children: notifications.map((notification) => ((0, jsx_runtime_1.jsx)(NotificationListItem_1.NotificationListItem, { notification: notification, onClick: onClickNotification }, notification.id))) }));
};
exports.NotificationList = NotificationList;
