"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtimeOrderEvents = exports.handleCustomerNotificationCreatedPayload = exports.handleRealtimeOrderPayload = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const notifications_1 = require("../../../../../../packages/shared-ui/notifications");
const notification_center_store_1 = require("../../notification-center/store/notification-center.store");
const customer_realtime_socket_service_1 = require("../services/customer-realtime-socket.service");
const realtime_order_store_1 = require("../store/realtime-order.store");
const realtime_order_types_1 = require("../types/realtime-order.types");
const realtime_order_event_mapper_1 = require("../utils/realtime-order-event.mapper");
const ORDER_EVENTS = [
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_ACCEPTED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_READY_FOR_PICKUP,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_CANCELLED,
];
const handleRealtimeOrderPayload = (payload, eventName) => {
    const event = (0, realtime_order_event_mapper_1.mapRealtimeOrderEventPayload)(payload, eventName);
    if (!event) {
        return;
    }
    const latestEvent = [...realtime_order_store_1.useRealtimeOrderStore.getState().realtimeOrderEvents]
        .reverse()
        .find((storedEvent) => storedEvent.orderId === event.orderId);
    if (latestEvent &&
        Date.parse(event.updatedAt) < Date.parse(latestEvent.updatedAt)) {
        return;
    }
    realtime_order_store_1.useRealtimeOrderStore.getState().addRealtimeOrderEvent(event);
};
exports.handleRealtimeOrderPayload = handleRealtimeOrderPayload;
const handleCustomerNotificationCreatedPayload = (payload) => {
    const notification = (0, notifications_1.getNotificationFromRealtimePayload)(payload);
    if (!notification) {
        return;
    }
    notification_center_store_1.useNotificationCenterStore.getState().prependNotification(notification);
    if ((0, notifications_1.shouldShowPriorityNotificationAlert)(notification)) {
        react_native_1.Alert.alert(notification.title, notification.message);
    }
};
exports.handleCustomerNotificationCreatedPayload = handleCustomerNotificationCreatedPayload;
const useRealtimeOrderEvents = () => {
    const socketConnected = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.socketConnected);
    (0, react_1.useEffect)(() => {
        const cleanupListeners = ORDER_EVENTS.map((eventName) => (0, customer_realtime_socket_service_1.addSocketListener)(eventName, (payload) => {
            (0, exports.handleRealtimeOrderPayload)(payload, eventName);
        }));
        cleanupListeners.push((0, customer_realtime_socket_service_1.addSocketListener)(notifications_1.NOTIFICATION_CREATED_EVENT, (payload) => {
            (0, exports.handleCustomerNotificationCreatedPayload)(payload);
        }));
        return () => {
            cleanupListeners.forEach((cleanup) => cleanup());
        };
    }, [socketConnected]);
};
exports.useRealtimeOrderEvents = useRealtimeOrderEvents;
