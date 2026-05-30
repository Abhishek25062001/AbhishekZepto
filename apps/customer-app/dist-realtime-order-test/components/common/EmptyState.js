"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function EmptyState({ actionLabel, description, onAction, title }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.description, children: description }), actionLabel && onAction ? ((0, jsx_runtime_1.jsx)(react_native_1.Pressable, { accessibilityRole: "button", onPress: onAction, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.action, children: actionLabel }) })) : null] }));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        gap: theme_1.spacing.sm,
        padding: theme_1.spacing.lg,
    },
    action: {
        color: theme_1.colors.primary,
        fontSize: theme_1.typography.small,
        fontWeight: '600',
    },
    description: {
        color: theme_1.colors.textSecondary,
        fontSize: theme_1.typography.small,
    },
    title: {
        color: theme_1.colors.textPrimary,
        fontSize: theme_1.typography.h3,
        fontWeight: '700',
    },
});
