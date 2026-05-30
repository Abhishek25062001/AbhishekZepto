"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationBell = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const NotificationUnreadBadge_1 = require("./NotificationUnreadBadge");
const NotificationBell = ({ unreadCount, onClick, }) => ((0, jsx_runtime_1.jsxs)("button", { "aria-label": "Open notifications", onClick: onClick, type: "button", children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: "Bell" }), (0, jsx_runtime_1.jsx)(NotificationUnreadBadge_1.NotificationUnreadBadge, { count: unreadCount })] }));
exports.NotificationBell = NotificationBell;
