"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = Badge;
const jsx_runtime_1 = require("react/jsx-runtime");
const variantStyles = {
    error: {
        background: 'color-mix(in srgb, var(--color-error) 14%, var(--color-surface))',
        color: 'var(--color-error)',
    },
    info: {
        background: 'color-mix(in srgb, var(--color-info) 14%, var(--color-surface))',
        color: 'var(--color-info)',
    },
    neutral: {
        background: 'var(--color-background)',
        color: 'var(--color-text-secondary)',
    },
    success: {
        background: 'color-mix(in srgb, var(--color-success) 14%, var(--color-surface))',
        color: 'var(--color-success)',
    },
    warning: {
        background: 'color-mix(in srgb, var(--color-warning) 18%, var(--color-surface))',
        color: 'var(--color-warning)',
    },
};
function Badge({ children, variant = 'neutral' }) {
    return ((0, jsx_runtime_1.jsx)("span", { style: {
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            fontSize: 12,
            fontWeight: 600,
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            ...variantStyles[variant],
        }, children: children }));
}
