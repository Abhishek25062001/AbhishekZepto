"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtimeDeliveryTrackingEvents = exports.handleRealtimeDeliveryTrackingPayload = void 0;
const react_1 = require("react");
const customer_realtime_socket_service_1 = require("../services/customer-realtime-socket.service");
const realtime_order_store_1 = require("../store/realtime-order.store");
const realtime_order_types_1 = require("../types/realtime-order.types");
const realtime_delivery_location_util_1 = require("../utils/realtime-delivery-location.util");
const DELIVERY_TRACKING_EVENTS = [
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.RIDER_REACHED_CUSTOMER,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_FAILED,
];
const getLatestDeliveryLocationEvent = (events, orderId) => {
    const matchingEvents = events.filter((event) => event.orderId === orderId &&
        event.eventName === realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    return matchingEvents.at(-1) ?? null;
};
const handleRealtimeDeliveryTrackingPayload = (payload, eventName) => {
    const event = (0, realtime_delivery_location_util_1.mapRealtimeDeliveryTrackingPayload)(payload, eventName);
    if (!event) {
        return;
    }
    const latestLocationEvent = getLatestDeliveryLocationEvent(realtime_order_store_1.useRealtimeOrderStore.getState().deliveryTrackingEvents, event.orderId);
    if ((0, realtime_delivery_location_util_1.isLocationEventStale)(event.lastLocationUpdatedAt, latestLocationEvent?.lastLocationUpdatedAt ?? null)) {
        return;
    }
    realtime_order_store_1.useRealtimeOrderStore.getState().addDeliveryTrackingEvent(event);
};
exports.handleRealtimeDeliveryTrackingPayload = handleRealtimeDeliveryTrackingPayload;
const useRealtimeDeliveryTrackingEvents = () => {
    const socketConnected = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.socketConnected);
    (0, react_1.useEffect)(() => {
        const cleanupListeners = DELIVERY_TRACKING_EVENTS.map((eventName) => (0, customer_realtime_socket_service_1.addSocketListener)(eventName, (payload) => {
            (0, exports.handleRealtimeDeliveryTrackingPayload)(payload, eventName);
        }));
        return () => {
            cleanupListeners.forEach((cleanup) => cleanup());
        };
    }, [socketConnected]);
};
exports.useRealtimeDeliveryTrackingEvents = useRealtimeDeliveryTrackingEvents;
