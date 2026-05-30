"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const NotificationList_1 = require("./NotificationList");
const NotificationDropdown = ({ isOpen, notifications, onClickNotification, onMarkAllRead, onViewAll, }) => {
    if (!isOpen) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("section", { "aria-label": "Notifications", children: [(0, jsx_runtime_1.jsx)(NotificationList_1.NotificationList, { notifications: notifications, onClickNotification: onClickNotification }), (0, jsx_runtime_1.jsx)("button", { onClick: onMarkAllRead, type: "button", children: "Mark all read" }), (0, jsx_runtime_1.jsx)("button", { onClick: onViewAll, type: "button", children: "View all" })] }));
};
exports.NotificationDropdown = NotificationDropdown;
