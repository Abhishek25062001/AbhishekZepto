"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeConnectionBanner = RealtimeConnectionBanner;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const common_1 = require("../../../components/common");
const theme_1 = require("../../../theme");
const realtime_order_store_1 = require("../store/realtime-order.store");
function RealtimeConnectionBanner() {
    const connectionState = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.connectionState);
    const connectionError = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.connectionError);
    const socketConnected = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.socketConnected);
    if (socketConnected || connectionState === 'idle' || connectionState === 'disconnected') {
        return null;
    }
    const message = connectionState === 'connecting' || connectionState === 'reconnecting'
        ? 'Connecting...'
        : connectionError ?? 'Realtime updates unavailable';
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.banner, children: (0, jsx_runtime_1.jsx)(common_1.Text, { color: "secondary", variant: "small", children: message }) }));
}
const styles = react_native_1.StyleSheet.create({
    banner: {
        backgroundColor: theme_1.colors.surface,
        borderColor: theme_1.colors.border,
        borderRadius: theme_1.radius.md,
        borderWidth: 1,
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
    },
});
