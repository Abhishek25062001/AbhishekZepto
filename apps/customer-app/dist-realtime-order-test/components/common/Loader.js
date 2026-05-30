"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = Loader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
function Loader({ mode = 'inline' }) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: [styles.container, mode === 'full-screen' && styles.fullScreen], children: (0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { color: theme_1.colors.primary }) }));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme_1.spacing.lg,
    },
    fullScreen: {
        flex: 1,
    },
});
