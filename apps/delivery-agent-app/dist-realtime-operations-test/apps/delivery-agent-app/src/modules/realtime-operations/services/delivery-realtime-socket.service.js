"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryReconnectConfig = exports.addDeliveryConnectionListener = exports.addDeliverySocketListener = exports.leaveAssignmentRoom = exports.joinAssignmentRoom = exports.disconnectDeliverySocket = exports.connectDeliverySocket = exports.getDeliveryRealtimeSocket = void 0;
const socket_io_client_1 = require("socket.io-client");
const env_1 = require("../../../config/env");
const DELIVERY_JOIN_ASSIGNMENT_ROOM_EVENT = 'delivery.join_assignment_room';
const DELIVERY_LEAVE_ASSIGNMENT_ROOM_EVENT = 'delivery.leave_assignment_room';
let deliverySocket = null;
let activeToken = null;
const getDeliveryRealtimeSocket = () => deliverySocket;
exports.getDeliveryRealtimeSocket = getDeliveryRealtimeSocket;
const connectDeliverySocket = (accessToken) => {
    if (deliverySocket && activeToken === accessToken) {
        if (!deliverySocket.connected) {
            deliverySocket.connect();
        }
        return deliverySocket;
    }
    (0, exports.disconnectDeliverySocket)();
    activeToken = accessToken;
    deliverySocket = (0, socket_io_client_1.io)(env_1.DELIVERY_SOCKET_BASE_URL, {
        auth: { token: accessToken },
        reconnection: false,
        timeout: env_1.DELIVERY_SOCKET_RECONNECT_DELAY_MS,
        transports: ['websocket'],
    });
    return deliverySocket;
};
exports.connectDeliverySocket = connectDeliverySocket;
const disconnectDeliverySocket = () => {
    if (!deliverySocket) {
        activeToken = null;
        return;
    }
    deliverySocket.removeAllListeners();
    deliverySocket.disconnect();
    deliverySocket = null;
    activeToken = null;
};
exports.disconnectDeliverySocket = disconnectDeliverySocket;
const joinAssignmentRoom = (assignmentId) => {
    const trimmedAssignmentId = assignmentId.trim();
    if (!deliverySocket || !trimmedAssignmentId) {
        return;
    }
    deliverySocket.emit(DELIVERY_JOIN_ASSIGNMENT_ROOM_EVENT, {
        assignmentId: trimmedAssignmentId,
    });
};
exports.joinAssignmentRoom = joinAssignmentRoom;
const leaveAssignmentRoom = (assignmentId) => {
    const trimmedAssignmentId = assignmentId.trim();
    if (!deliverySocket || !trimmedAssignmentId) {
        return;
    }
    deliverySocket.emit(DELIVERY_LEAVE_ASSIGNMENT_ROOM_EVENT, {
        assignmentId: trimmedAssignmentId,
    });
};
exports.leaveAssignmentRoom = leaveAssignmentRoom;
const addDeliverySocketListener = (eventName, listener) => {
    if (!deliverySocket) {
        return () => undefined;
    }
    deliverySocket.on(eventName, listener);
    return () => {
        deliverySocket?.off(eventName, listener);
    };
};
exports.addDeliverySocketListener = addDeliverySocketListener;
const addDeliveryConnectionListener = (eventName, listener) => {
    if (!deliverySocket) {
        return () => undefined;
    }
    deliverySocket.on(eventName, listener);
    return () => {
        deliverySocket?.off(eventName, listener);
    };
};
exports.addDeliveryConnectionListener = addDeliveryConnectionListener;
const getDeliveryReconnectConfig = () => ({
    attempts: env_1.DELIVERY_SOCKET_RECONNECT_ATTEMPTS,
    delayMs: env_1.DELIVERY_SOCKET_RECONNECT_DELAY_MS,
});
exports.getDeliveryReconnectConfig = getDeliveryReconnectConfig;
