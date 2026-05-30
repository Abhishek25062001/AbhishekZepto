"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = Input;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function Input({ accessibilityLabel, disabled = false, error, keyboardType, label, onChangeText, placeholder, secureTextEntry = false, value, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: label }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { accessibilityLabel: accessibilityLabel ?? label, accessibilityState: { disabled }, editable: !disabled, keyboardType: keyboardType, onChangeText: onChangeText, placeholder: placeholder, placeholderTextColor: theme_1.colors.textDisabled, secureTextEntry: secureTextEntry, style: [styles.input, error ? styles.inputError : null, disabled && styles.inputDisabled], value: value }), error ? (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.error, children: error }) : null] }));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        gap: theme_1.spacing.xs,
    },
    error: {
        color: theme_1.colors.error,
        fontSize: theme_1.typography.caption,
    },
    input: {
        borderColor: theme_1.colors.border,
        borderRadius: theme_1.radius.md,
        borderWidth: 1,
        color: theme_1.colors.textPrimary,
        fontSize: theme_1.typography.body,
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
    },
    inputDisabled: {
        backgroundColor: theme_1.colors.background,
        color: theme_1.colors.textDisabled,
    },
    inputError: {
        borderColor: theme_1.colors.error,
    },
    label: {
        color: theme_1.colors.textPrimary,
        fontSize: theme_1.typography.small,
        fontWeight: '600',
    },
});
