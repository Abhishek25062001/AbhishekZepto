"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = Text;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function Text({ children, color = 'primary', variant = 'body' }) {
    return (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [variantStyles[variant], colorStyles[color]], children: children });
}
const variantStyles = react_native_1.StyleSheet.create({
    body: {
        fontSize: theme_1.typography.body,
    },
    caption: {
        fontSize: theme_1.typography.caption,
    },
    h1: {
        fontSize: theme_1.typography.h1,
        fontWeight: '700',
    },
    h2: {
        fontSize: theme_1.typography.h2,
        fontWeight: '700',
    },
    h3: {
        fontSize: theme_1.typography.h3,
        fontWeight: '700',
    },
    small: {
        fontSize: theme_1.typography.small,
    },
});
const colorStyles = react_native_1.StyleSheet.create({
    disabled: {
        color: theme_1.colors.textDisabled,
    },
    error: {
        color: theme_1.colors.error,
    },
    primary: {
        color: theme_1.colors.textPrimary,
    },
    secondary: {
        color: theme_1.colors.textSecondary,
    },
    success: {
        color: theme_1.colors.success,
    },
    warning: {
        color: theme_1.colors.warning,
    },
});
