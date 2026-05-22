"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorView = ErrorView;
const jsx_runtime_1 = require("react/jsx-runtime");
function ErrorView({ message = 'Something went wrong.', onRetry, retryLabel = 'Retry', title = 'Error', }) {
    return ((0, jsx_runtime_1.jsxs)("section", { role: "alert", children: [(0, jsx_runtime_1.jsx)("h2", { children: title }), (0, jsx_runtime_1.jsx)("p", { children: message }), onRetry ? ((0, jsx_runtime_1.jsx)("button", { onClick: onRetry, type: "button", children: retryLabel })) : null] }));
}
