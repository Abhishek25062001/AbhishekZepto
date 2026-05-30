"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRealtimeConnectionBanner = DeliveryRealtimeConnectionBanner;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
function DeliveryRealtimeConnectionBanner() {
    const connectionState = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.connectionState);
    const connectionError = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.connectionError);
    if (connectionState === 'connected' || connectionState === 'idle') {
        return null;
    }
    const isFailure = connectionState === 'failed';
    const message = isFailure
        ? connectionError ?? 'Live updates unavailable'
        : 'Reconnecting live updates...';
    return (<react_native_1.View style={[styles.banner, isFailure ? styles.failure : styles.reconnecting]}>
      <react_native_1.Text style={styles.message}>{message}</react_native_1.Text>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    banner: {
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    failure: {
        backgroundColor: 'rgba(220, 38, 38, 0.14)',
        borderColor: 'rgba(220, 38, 38, 0.5)',
    },
    message: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    reconnecting: {
        backgroundColor: 'rgba(245, 158, 11, 0.16)',
        borderColor: 'rgba(245, 158, 11, 0.55)',
    },
});
