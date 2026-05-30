"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationBell = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const NotificationUnreadBadge_1 = require("./NotificationUnreadBadge");
const NotificationBell = ({ unreadCount, onPress, }) => ((0, jsx_runtime_1.jsxs)(react_native_1.Pressable, { accessibilityLabel: "Open notifications", onPress: onPress, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { children: "Notifications" }), (0, jsx_runtime_1.jsx)(NotificationUnreadBadge_1.NotificationUnreadBadge, { count: unreadCount })] }));
exports.NotificationBell = NotificationBell;
