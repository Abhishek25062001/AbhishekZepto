"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenWrapper = ScreenWrapper;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function ScreenWrapper({ backgroundColor = theme_1.colors.surface, children, scrollable = false, }) {
    const content = scrollable ? ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { contentContainerStyle: styles.scrollContent, children: children })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.content, children: children }));
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { style: [styles.safeArea, { backgroundColor }], children: (0, jsx_runtime_1.jsx)(react_native_1.KeyboardAvoidingView, { behavior: react_native_1.Platform.OS === 'ios' ? 'padding' : undefined, style: styles.keyboardView, children: content }) }));
}
const styles = react_native_1.StyleSheet.create({
    content: {
        flex: 1,
        padding: theme_1.spacing.xl,
    },
    keyboardView: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme_1.spacing.xl,
    },
});
