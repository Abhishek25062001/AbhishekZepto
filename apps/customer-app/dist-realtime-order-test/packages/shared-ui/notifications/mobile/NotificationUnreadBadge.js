"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUnreadBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const NotificationUnreadBadge = ({ count }) => {
    if (count <= 0) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(react_native_1.Text, { accessibilityLabel: `${count} unread notifications`, children: count > 99 ? '99+' : count });
};
exports.NotificationUnreadBadge = NotificationUnreadBadge;
