"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewAssignmentAlert = NewAssignmentAlert;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useAppNavigation_1 = require("../../../hooks/useAppNavigation");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
const formatPickupEta = (pickupEta) => pickupEta ? new Date(pickupEta).toLocaleTimeString() : 'Awaiting ETA';
function NewAssignmentAlert() {
    const navigation = (0, useAppNavigation_1.useAppNavigation)();
    const lastAssignmentEvent = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.lastAssignmentEvent);
    if (!lastAssignmentEvent ||
        lastAssignmentEvent.eventName !== delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED) {
        return null;
    }
    const assignmentLabel = lastAssignmentEvent.assignmentCode ??
        lastAssignmentEvent.assignmentId.slice(-8).toUpperCase();
    return (<react_native_1.TouchableOpacity activeOpacity={0.86} onPress={() => navigation.navigate('DeliveryHome')} style={styles.card}>
      <react_native_1.View style={styles.headerRow}>
        <react_native_1.Text style={styles.title}>New delivery assigned</react_native_1.Text>
        <react_native_1.Text style={styles.action}>Open</react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={styles.detailRow}>
        <react_native_1.Text style={styles.label}>Assignment</react_native_1.Text>
        <react_native_1.Text style={styles.value}>{assignmentLabel}</react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={styles.detailRow}>
        <react_native_1.Text style={styles.label}>Order</react_native_1.Text>
        <react_native_1.Text style={styles.value}>{lastAssignmentEvent.orderId}</react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={styles.detailRow}>
        <react_native_1.Text style={styles.label}>Pickup ETA</react_native_1.Text>
        <react_native_1.Text style={styles.value}>
          {formatPickupEta(lastAssignmentEvent.pickupEta)}
        </react_native_1.Text>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
}
const styles = react_native_1.StyleSheet.create({
    action: {
        color: '#22C55E',
        fontSize: 13,
        fontWeight: '700',
    },
    card: {
        backgroundColor: 'rgba(22, 163, 74, 0.14)',
        borderColor: 'rgba(34, 197, 94, 0.55)',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        padding: 12,
    },
    detailRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: 'rgba(226, 232, 240, 0.72)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    value: {
        color: '#FFFFFF',
        flexShrink: 1,
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 12,
        textAlign: 'right',
    },
});
