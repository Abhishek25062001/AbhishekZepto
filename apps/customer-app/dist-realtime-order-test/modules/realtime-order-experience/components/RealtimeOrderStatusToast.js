"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeOrderStatusToast = RealtimeOrderStatusToast;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const common_1 = require("../../../components/common");
const theme_1 = require("../../../theme");
const realtime_order_types_1 = require("../types/realtime-order.types");
const realtime_order_store_1 = require("../store/realtime-order.store");
const STATUS_MESSAGES = {
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED]: 'Your order has been accepted',
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED]: 'Your order is packed',
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY]: 'Your order is out for delivery',
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED]: 'Your order has been delivered',
};
function RealtimeOrderStatusToast({ orderId }) {
    const events = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.realtimeOrderEvents);
    const latestEvent = [...events]
        .reverse()
        .find((event) => !orderId || event.orderId === orderId);
    const message = latestEvent ? STATUS_MESSAGES[latestEvent.orderStatus] : null;
    if (!message) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.toast, children: (0, jsx_runtime_1.jsx)(common_1.Text, { variant: "small", children: message }) }));
}
const styles = react_native_1.StyleSheet.create({
    toast: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: theme_1.colors.primary,
        borderRadius: theme_1.radius.md,
        borderWidth: 1,
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
    },
});
