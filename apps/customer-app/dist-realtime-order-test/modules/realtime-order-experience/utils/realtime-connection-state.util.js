"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealtimeRoomsToRestore = exports.isRealtimeAuthSocketFailure = exports.toRealtimeConnectionErrorMessage = void 0;
const toRealtimeConnectionErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Realtime connection failed';
};
exports.toRealtimeConnectionErrorMessage = toRealtimeConnectionErrorMessage;
const isRealtimeAuthSocketFailure = (value) => {
    const message = (0, exports.toRealtimeConnectionErrorMessage)(value).toLowerCase();
    return (message.includes('unauthorized') ||
        message.includes('forbidden') ||
        message.includes('invalid_socket_token') ||
        message.includes('invalid token') ||
        message.includes('auth'));
};
exports.isRealtimeAuthSocketFailure = isRealtimeAuthSocketFailure;
const getRealtimeRoomsToRestore = (activeOrderRooms) => activeOrderRooms.filter((orderId) => orderId.trim().length > 0);
exports.getRealtimeRoomsToRestore = getRealtimeRoomsToRestore;
