"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
const jsx_runtime_1 = require("react/jsx-runtime");
function Card({ children, description, footer, title }) {
    return ((0, jsx_runtime_1.jsxs)("section", { style: {
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
        }, children: [title ? (0, jsx_runtime_1.jsx)("h2", { children: title }) : null, description ? (0, jsx_runtime_1.jsx)("p", { style: { color: 'var(--color-text-secondary)' }, children: description }) : null, children, footer ? (0, jsx_runtime_1.jsx)("footer", { style: { marginTop: 'var(--spacing-lg)' }, children: footer }) : null] }));
}
