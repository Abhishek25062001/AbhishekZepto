"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtimeOrderRoom = void 0;
const react_1 = require("react");
const customer_realtime_socket_service_1 = require("../services/customer-realtime-socket.service");
const realtime_order_store_1 = require("../store/realtime-order.store");
const useRealtimeOrderRoom = (orderId) => {
    const joinOrderRoom = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.joinOrderRoom);
    const leaveOrderRoom = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.leaveOrderRoom);
    const socketConnected = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.socketConnected);
    (0, react_1.useEffect)(() => {
        const normalizedOrderId = orderId?.trim();
        if (!normalizedOrderId) {
            return undefined;
        }
        const alreadyJoined = realtime_order_store_1.useRealtimeOrderStore
            .getState()
            .activeOrderRooms.includes(normalizedOrderId);
        if (!alreadyJoined) {
            joinOrderRoom(normalizedOrderId);
        }
        if (socketConnected || (0, customer_realtime_socket_service_1.getCustomerRealtimeSocket)()?.connected) {
            (0, customer_realtime_socket_service_1.joinOrderRoom)(normalizedOrderId);
        }
        return () => {
            leaveOrderRoom(normalizedOrderId);
            (0, customer_realtime_socket_service_1.leaveOrderRoom)(normalizedOrderId);
        };
    }, [joinOrderRoom, leaveOrderRoom, orderId, socketConnected]);
};
exports.useRealtimeOrderRoom = useRealtimeOrderRoom;
