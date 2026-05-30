"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryRealtimeEvents = exports.handleDeliveryNotificationCreatedPayload = exports.handleDeliveryRealtimePayload = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const notifications_1 = require("../../../../../../packages/shared-ui/notifications");
const notification_center_store_1 = require("../../notification-center/store/notification-center.store");
const delivery_store_1 = require("../../../store/delivery.store");
const delivery_realtime_socket_service_1 = require("../services/delivery-realtime-socket.service");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
const delivery_realtime_event_mapper_1 = require("../utils/delivery-realtime-event.mapper");
const delivery_realtime_stale_event_util_1 = require("../utils/delivery-realtime-stale-event.util");
const DELIVERY_EVENTS = [
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
];
const isAssignmentRealtimeEvent = (event) => event?.eventName === delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED ||
    event?.eventName === delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED;
const isStatusRealtimeEvent = (event) => Boolean(event) && !isAssignmentRealtimeEvent(event);
const handleDeliveryRealtimePayload = (payload, eventName) => {
    const event = (0, delivery_realtime_event_mapper_1.mapDeliveryRealtimeEventPayload)(payload, eventName);
    if (!event) {
        return;
    }
    if (isAssignmentRealtimeEvent(event)) {
        if ((0, delivery_realtime_stale_event_util_1.shouldIgnoreAssignmentRealtimeEvent)(event, delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastAssignmentEvent)) {
            return;
        }
        delivery_realtime_store_1.useDeliveryRealtimeStore.getState().setLastAssignmentEvent(event);
        if (event.eventName === delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED) {
            delivery_store_1.useDeliveryStore.getState().clearCurrentDelivery();
            return;
        }
        delivery_store_1.useDeliveryStore.getState().setCurrentDelivery({
            currentAssignmentId: event.assignmentId,
            currentOrderId: event.orderId,
            currentDeliveryStatus: event.deliveryStatus,
        });
        return;
    }
    if (isStatusRealtimeEvent(event)) {
        if ((0, delivery_realtime_stale_event_util_1.shouldIgnoreStatusRealtimeEvent)(event, delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastStatusEvent)) {
            return;
        }
        delivery_realtime_store_1.useDeliveryRealtimeStore.getState().setLastStatusEvent(event);
        if (event.eventName === delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED) {
            delivery_realtime_store_1.useDeliveryRealtimeStore.getState().setLocationSyncPaused(true);
            delivery_realtime_store_1.useDeliveryRealtimeStore
                .getState()
                .setLocationSyncError(event.rejectionReason ?? 'Location sync was rejected');
        }
        delivery_store_1.useDeliveryStore.getState().setCurrentDelivery({
            currentAssignmentId: event.assignmentId,
            currentOrderId: event.orderId,
            currentDeliveryStatus: event.deliveryStatus,
        });
    }
};
exports.handleDeliveryRealtimePayload = handleDeliveryRealtimePayload;
const handleDeliveryNotificationCreatedPayload = (payload) => {
    const notification = (0, notifications_1.getNotificationFromRealtimePayload)(payload);
    if (!notification) {
        return;
    }
    notification_center_store_1.useNotificationCenterStore.getState().prependNotification(notification);
    if ((0, notifications_1.shouldShowPriorityNotificationAlert)(notification)) {
        react_native_1.Alert.alert(notification.title, notification.message);
    }
};
exports.handleDeliveryNotificationCreatedPayload = handleDeliveryNotificationCreatedPayload;
const useDeliveryRealtimeEvents = () => {
    const socketConnected = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.socketConnected);
    (0, react_1.useEffect)(() => {
        const cleanupListeners = DELIVERY_EVENTS.map((eventName) => (0, delivery_realtime_socket_service_1.addDeliverySocketListener)(eventName, (payload) => {
            (0, exports.handleDeliveryRealtimePayload)(payload, eventName);
        }));
        cleanupListeners.push((0, delivery_realtime_socket_service_1.addDeliverySocketListener)(notifications_1.NOTIFICATION_CREATED_EVENT, (payload) => {
            (0, exports.handleDeliveryNotificationCreatedPayload)(payload);
        }));
        return () => {
            cleanupListeners.forEach((cleanup) => cleanup());
        };
    }, [socketConnected]);
};
exports.useDeliveryRealtimeEvents = useDeliveryRealtimeEvents;
