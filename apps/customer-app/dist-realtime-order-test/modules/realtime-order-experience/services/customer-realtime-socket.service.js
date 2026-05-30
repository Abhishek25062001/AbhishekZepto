"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReconnectConfig = exports.addConnectionListener = exports.addSocketListener = exports.leaveOrderRoom = exports.joinOrderRoom = exports.disconnectSocket = exports.connectSocket = exports.getCustomerRealtimeSocket = void 0;
const socket_io_client_1 = require("socket.io-client");
const env_1 = require("../../../config/env");
const CUSTOMER_JOIN_ORDER_ROOM_EVENT = 'customer.join_order_room';
const CUSTOMER_LEAVE_ORDER_ROOM_EVENT = 'customer.leave_order_room';
let customerSocket = null;
let activeToken = null;
const getCustomerRealtimeSocket = () => customerSocket;
exports.getCustomerRealtimeSocket = getCustomerRealtimeSocket;
const connectSocket = (accessToken) => {
    if (customerSocket && activeToken === accessToken) {
        if (!customerSocket.connected) {
            customerSocket.connect();
        }
        return customerSocket;
    }
    (0, exports.disconnectSocket)();
    activeToken = accessToken;
    customerSocket = (0, socket_io_client_1.io)(env_1.CUSTOMER_SOCKET_BASE_URL, {
        auth: { token: accessToken },
        reconnection: false,
        timeout: env_1.CUSTOMER_SOCKET_RECONNECT_DELAY_MS,
        transports: ['websocket'],
    });
    return customerSocket;
};
exports.connectSocket = connectSocket;
const disconnectSocket = () => {
    if (!customerSocket) {
        activeToken = null;
        return;
    }
    customerSocket.removeAllListeners();
    customerSocket.disconnect();
    customerSocket = null;
    activeToken = null;
};
exports.disconnectSocket = disconnectSocket;
const joinOrderRoom = (orderId) => {
    const trimmedOrderId = orderId.trim();
    if (!customerSocket || !trimmedOrderId) {
        return;
    }
    customerSocket.emit(CUSTOMER_JOIN_ORDER_ROOM_EVENT, { orderId: trimmedOrderId });
};
exports.joinOrderRoom = joinOrderRoom;
const leaveOrderRoom = (orderId) => {
    const trimmedOrderId = orderId.trim();
    if (!customerSocket || !trimmedOrderId) {
        return;
    }
    customerSocket.emit(CUSTOMER_LEAVE_ORDER_ROOM_EVENT, { orderId: trimmedOrderId });
};
exports.leaveOrderRoom = leaveOrderRoom;
const addSocketListener = (eventName, listener) => {
    if (!customerSocket) {
        return () => undefined;
    }
    customerSocket.on(eventName, listener);
    return () => {
        customerSocket?.off(eventName, listener);
    };
};
exports.addSocketListener = addSocketListener;
const addConnectionListener = (eventName, listener) => {
    if (!customerSocket) {
        return () => undefined;
    }
    customerSocket.on(eventName, listener);
    return () => {
        customerSocket?.off(eventName, listener);
    };
};
exports.addConnectionListener = addConnectionListener;
const getReconnectConfig = () => ({
    attempts: env_1.CUSTOMER_SOCKET_RECONNECT_ATTEMPTS,
    delayMs: env_1.CUSTOMER_SOCKET_RECONNECT_DELAY_MS,
});
exports.getReconnectConfig = getReconnectConfig;
