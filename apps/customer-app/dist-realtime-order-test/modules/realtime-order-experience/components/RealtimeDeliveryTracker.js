"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeDeliveryTracker = RealtimeDeliveryTracker;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const common_1 = require("../../../components/common");
const theme_1 = require("../../../theme");
const useRealtimeDeliveryTrackingEvents_1 = require("../hooks/useRealtimeDeliveryTrackingEvents");
const realtime_order_store_1 = require("../store/realtime-order.store");
const realtime_order_types_1 = require("../types/realtime-order.types");
const realtime_delivery_location_util_1 = require("../utils/realtime-delivery-location.util");
function RealtimeDeliveryTracker({ orderId, pollingDelivery, }) {
    (0, useRealtimeDeliveryTrackingEvents_1.useRealtimeDeliveryTrackingEvents)();
    const socketConnected = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.socketConnected);
    const latestRealtimeEvent = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => [...state.deliveryTrackingEvents]
        .reverse()
        .find((event) => event.orderId === orderId));
    const hasRealtimeLocation = (0, realtime_delivery_location_util_1.hasValidRealtimeCoordinates)(latestRealtimeEvent?.currentLatitude ?? null, latestRealtimeEvent?.currentLongitude ?? null);
    const lastUpdatedAt = latestRealtimeEvent?.lastLocationUpdatedAt ??
        latestRealtimeEvent?.updatedAt ??
        pollingDelivery?.completedAt ??
        pollingDelivery?.deliveredAt ??
        null;
    const progressStatus = latestRealtimeEvent?.progressStatus || pollingDelivery?.deliveryStatus || null;
    const isDelivered = latestRealtimeEvent?.eventName === realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED ||
        progressStatus === 'delivered';
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.card, children: [(0, jsx_runtime_1.jsx)(common_1.Text, { variant: "h3", children: "Live rider location" }), hasRealtimeLocation && !isDelivered ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.locationRow, children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.marker }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.locationCopy, children: [(0, jsx_runtime_1.jsxs)(common_1.Text, { variant: "small", children: [latestRealtimeEvent?.currentLatitude?.toFixed(5), ",", ' ', latestRealtimeEvent?.currentLongitude?.toFixed(5)] }), (0, jsx_runtime_1.jsxs)(common_1.Text, { color: "secondary", variant: "small", children: ["Updated ", lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : 'now'] })] })] })) : ((0, jsx_runtime_1.jsx)(common_1.Text, { color: "secondary", variant: "small", children: socketConnected
                    ? 'Waiting for rider location update.'
                    : 'Realtime updates unavailable. Polling delivery status.' })), progressStatus ? ((0, jsx_runtime_1.jsxs)(common_1.Text, { color: "secondary", variant: "small", children: ["Status: ", progressStatus.replaceAll('_', ' ')] })) : null] }));
}
const styles = react_native_1.StyleSheet.create({
    card: {
        backgroundColor: theme_1.colors.surface,
        borderColor: theme_1.colors.border,
        borderRadius: theme_1.radius.lg,
        borderWidth: 1,
        gap: theme_1.spacing.sm,
        padding: theme_1.spacing.md,
    },
    locationCopy: {
        flex: 1,
        gap: theme_1.spacing.xs,
    },
    locationRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme_1.spacing.sm,
    },
    marker: {
        backgroundColor: theme_1.colors.primary,
        borderColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 2,
        height: 16,
        width: 16,
    },
});
