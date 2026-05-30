"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUnreadBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const NotificationUnreadBadge = ({ count }) => {
    if (count <= 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("span", { "aria-label": `${count} unread notifications`, "data-testid": "notification-unread-badge", children: count > 99 ? '99+' : count }));
};
exports.NotificationUnreadBadge = NotificationUnreadBadge;
