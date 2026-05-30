"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorView = ErrorView;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function ErrorView({ message, onRetry, retryLabel = 'Retry', title = 'Something went wrong', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.message, children: message }), onRetry ? ((0, jsx_runtime_1.jsx)(react_native_1.Pressable, { accessibilityRole: "button", onPress: onRetry, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.retry, children: retryLabel }) })) : null] }));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        gap: theme_1.spacing.md,
        padding: theme_1.spacing.lg,
    },
    message: {
        color: theme_1.colors.error,
        fontSize: theme_1.typography.small,
    },
    retry: {
        color: theme_1.colors.primary,
        fontSize: theme_1.typography.small,
        fontWeight: '600',
    },
    title: {
        color: theme_1.colors.textPrimary,
        fontSize: theme_1.typography.h3,
        fontWeight: '700',
    },
});
