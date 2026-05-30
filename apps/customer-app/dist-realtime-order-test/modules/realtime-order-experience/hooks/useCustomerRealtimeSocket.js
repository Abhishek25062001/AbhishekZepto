"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomerRealtimeSocket = void 0;
const react_1 = require("react");
const auth_store_1 = require("../../../store/auth.store");
const customer_realtime_socket_service_1 = require("../services/customer-realtime-socket.service");
const realtime_order_store_1 = require("../store/realtime-order.store");
const toErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Realtime connection failed';
};
const isAuthSocketFailure = (value) => {
    const message = toErrorMessage(value).toLowerCase();
    return (message.includes('unauthorized') ||
        message.includes('forbidden') ||
        message.includes('invalid_socket_token') ||
        message.includes('invalid token') ||
        message.includes('auth'));
};
const useCustomerRealtimeSocket = () => {
    const accessToken = (0, auth_store_1.useAuthStore)((state) => state.accessToken);
    const clearAuthSession = (0, auth_store_1.useAuthStore)((state) => state.clearAuthSession);
    const isAuthenticated = (0, auth_store_1.useAuthStore)((state) => state.isAuthenticated);
    const setSocketConnected = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.setSocketConnected);
    const setConnectionState = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.setConnectionState);
    const setConnectionError = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.setConnectionError);
    const clearRealtimeOrderState = (0, realtime_order_store_1.useRealtimeOrderStore)((state) => state.clearRealtimeOrderState);
    const reconnectTimer = (0, react_1.useRef)(null);
    const reconnectAttempts = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        if (!isAuthenticated || !accessToken) {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
            (0, customer_realtime_socket_service_1.disconnectSocket)();
            clearRealtimeOrderState();
            return undefined;
        }
        setConnectionState('connecting');
        const socket = (0, customer_realtime_socket_service_1.connectSocket)(accessToken);
        const scheduleReconnect = () => {
            if (reconnectTimer.current) {
                return;
            }
            const reconnectConfig = (0, customer_realtime_socket_service_1.getReconnectConfig)();
            if (reconnectAttempts.current >= reconnectConfig.attempts) {
                setConnectionState('failed');
                setConnectionError('Realtime updates unavailable');
                return;
            }
            reconnectAttempts.current += 1;
            setConnectionState('reconnecting');
            reconnectTimer.current = setTimeout(() => {
                reconnectTimer.current = null;
                socket.connect();
            }, reconnectConfig.delayMs);
        };
        const cleanupListeners = [
            (0, customer_realtime_socket_service_1.addConnectionListener)('connect', () => {
                reconnectAttempts.current = 0;
                setSocketConnected(true);
                setConnectionError(null);
                realtime_order_store_1.useRealtimeOrderStore
                    .getState()
                    .activeOrderRooms.forEach((activeOrderId) => (0, customer_realtime_socket_service_1.joinOrderRoom)(activeOrderId));
            }),
            (0, customer_realtime_socket_service_1.addConnectionListener)('connect_error', (error) => {
                setSocketConnected(false);
                setConnectionError(toErrorMessage(error));
                if (isAuthSocketFailure(error)) {
                    clearRealtimeOrderState();
                    clearAuthSession();
                    (0, customer_realtime_socket_service_1.disconnectSocket)();
                    return;
                }
                scheduleReconnect();
            }),
            (0, customer_realtime_socket_service_1.addConnectionListener)('disconnect', (reason) => {
                setSocketConnected(false);
                setConnectionError(typeof reason === 'string' ? reason : null);
                if (isAuthSocketFailure(reason)) {
                    clearRealtimeOrderState();
                    clearAuthSession();
                    (0, customer_realtime_socket_service_1.disconnectSocket)();
                    return;
                }
                scheduleReconnect();
            }),
        ];
        return () => {
            cleanupListeners.forEach((cleanup) => cleanup());
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
            reconnectAttempts.current = 0;
        };
    }, [
        accessToken,
        clearAuthSession,
        clearRealtimeOrderState,
        isAuthenticated,
        setConnectionError,
        setConnectionState,
        setSocketConnected,
    ]);
};
exports.useCustomerRealtimeSocket = useCustomerRealtimeSocket;
