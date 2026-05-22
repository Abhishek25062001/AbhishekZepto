"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const variantStyles = {
    danger: {
        background: 'var(--color-error)',
        borderColor: 'var(--color-error)',
        color: 'var(--color-surface)',
    },
    ghost: {
        background: 'transparent',
        borderColor: 'transparent',
        color: 'var(--color-primary)',
    },
    outline: {
        background: 'transparent',
        borderColor: 'var(--color-primary)',
        color: 'var(--color-primary)',
    },
    primary: {
        background: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        color: 'var(--color-surface)',
    },
    secondary: {
        background: 'var(--color-primary-light)',
        borderColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
    },
};
const sizeStyles = {
    lg: {
        padding: 'var(--spacing-lg) var(--spacing-xl)',
    },
    md: {
        padding: 'var(--spacing-md) var(--spacing-lg)',
    },
    sm: {
        padding: 'var(--spacing-sm) var(--spacing-md)',
    },
};
function Button({ children, disabled, loading = false, onBlur, onFocus, size = 'md', style, type = 'button', variant = 'primary', ...props }) {
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const isDisabled = disabled || loading;
    return ((0, jsx_runtime_1.jsx)("button", { ...props, disabled: isDisabled, onBlur: event => {
            setIsFocused(false);
            onBlur?.(event);
        }, onFocus: event => {
            setIsFocused(true);
            onFocus?.(event);
        }, style: {
            borderRadius: 'var(--radius-md)',
            borderStyle: 'solid',
            borderWidth: 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            minHeight: 44,
            opacity: isDisabled ? 0.7 : 1,
            outline: isFocused ? '2px solid var(--color-primary)' : '2px solid transparent',
            outlineOffset: 2,
            ...variantStyles[variant],
            ...sizeStyles[size],
            ...style,
        }, type: type, children: loading ? 'Loading...' : children }));
}
