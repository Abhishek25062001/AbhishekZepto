"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
const jsx_runtime_1 = require("react/jsx-runtime");
function EmptyState({ actionLabel, description, message, onAction, title = 'No data', }) {
    return ((0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h2", { children: title }), (0, jsx_runtime_1.jsx)("p", { children: description ?? message ?? 'There is nothing to show yet.' }), actionLabel && onAction ? ((0, jsx_runtime_1.jsx)("button", { onClick: onAction, type: "button", children: actionLabel })) : null] }));
}
