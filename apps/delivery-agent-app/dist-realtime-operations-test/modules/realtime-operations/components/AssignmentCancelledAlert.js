"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentCancelledAlert = AssignmentCancelledAlert;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const delivery_store_1 = require("../../../store/delivery.store");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
function AssignmentCancelledAlert() {
    const [acknowledgedEventId, setAcknowledgedEventId] = (0, react_1.useState)(null);
    const clearCurrentDelivery = (0, delivery_store_1.useDeliveryStore)((state) => state.clearCurrentDelivery);
    const lastAssignmentEvent = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.lastAssignmentEvent);
    if (!lastAssignmentEvent ||
        lastAssignmentEvent.eventName !== delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED) {
        return null;
    }
    const eventKey = lastAssignmentEvent.eventId ??
        `${lastAssignmentEvent.assignmentId}:${lastAssignmentEvent.updatedAt}`;
    if (acknowledgedEventId === eventKey) {
        return null;
    }
    return (<react_native_1.View style={styles.card}>
      <react_native_1.Text style={styles.title}>Assignment cancelled</react_native_1.Text>
      <react_native_1.Text style={styles.body}>
        Assignment {lastAssignmentEvent.assignmentId.slice(-8).toUpperCase()} is no
        longer active.
      </react_native_1.Text>
      <react_native_1.TouchableOpacity activeOpacity={0.86} onPress={() => {
            clearCurrentDelivery();
            setAcknowledgedEventId(eventKey);
        }} style={styles.button}>
        <react_native_1.Text style={styles.buttonText}>Acknowledge</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    body: {
        color: 'rgba(254, 226, 226, 0.85)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 10,
    },
    button: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    buttonText: {
        color: '#B91C1C',
        fontSize: 13,
        fontWeight: '700',
    },
    card: {
        backgroundColor: 'rgba(220, 38, 38, 0.16)',
        borderColor: 'rgba(220, 38, 38, 0.55)',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        padding: 12,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },
});
