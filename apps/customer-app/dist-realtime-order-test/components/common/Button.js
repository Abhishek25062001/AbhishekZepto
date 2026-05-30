"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function Button({ accessibilityLabel, disabled = false, loading = false, onPress, size = 'md', title, variant = 'primary', }) {
    const isDisabled = disabled || loading;
    const textColor = getTextColor(variant, isDisabled);
    return ((0, jsx_runtime_1.jsx)(react_native_1.Pressable, { accessibilityLabel: accessibilityLabel ?? title, accessibilityRole: "button", accessibilityState: { disabled: isDisabled }, disabled: isDisabled, onPress: onPress, style: [
            styles.button,
            sizeStyles[size],
            variantStyles[variant],
            isDisabled && styles.buttonDisabled,
        ], children: loading ? ((0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { color: textColor })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.title, { color: textColor }], children: title })) }));
}
function getTextColor(variant, isDisabled) {
    if (isDisabled) {
        return theme_1.colors.textDisabled;
    }
    if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
        return theme_1.colors.primary;
    }
    return theme_1.colors.surface;
}
const styles = react_native_1.StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: theme_1.radius.md,
        borderWidth: 1,
        minHeight: 44,
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: theme_1.colors.border,
        borderColor: theme_1.colors.border,
    },
    title: {
        fontSize: theme_1.typography.body,
        fontWeight: '600',
    },
});
const sizeStyles = react_native_1.StyleSheet.create({
    sm: {
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
    },
    md: {
        paddingHorizontal: theme_1.spacing.lg,
        paddingVertical: theme_1.spacing.md,
    },
    lg: {
        paddingHorizontal: theme_1.spacing.xl,
        paddingVertical: theme_1.spacing.lg,
    },
});
const variantStyles = react_native_1.StyleSheet.create({
    danger: {
        backgroundColor: theme_1.colors.error,
        borderColor: theme_1.colors.error,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    outline: {
        backgroundColor: 'transparent',
        borderColor: theme_1.colors.primary,
    },
    primary: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primary,
    },
    secondary: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: theme_1.colors.primaryLight,
    },
});
