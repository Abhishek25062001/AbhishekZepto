"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryRealtimeSocket = void 0;
const react_1 = require("react");
const auth_store_1 = require("../../../store/auth.store");
const token_refresh_service_1 = require("../../../services/auth/token-refresh.service");
const delivery_realtime_socket_service_1 = require("../services/delivery-realtime-socket.service");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const toRealtimeConnectionErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Delivery live updates failed';
};
const isRealtimeAuthFailure = (error) => {
    const message = toRealtimeConnectionErrorMessage(error).toLowerCase();
    return (message.includes('unauthorized') ||
        message.includes('forbidden') ||
        message.includes('invalid_socket_token') ||
        message.includes('invalid token') ||
        message.includes('auth'));
};
const useDeliveryRealtimeSocket = () => {
    const accessToken = (0, auth_store_1.useAuthStore)((state) => state.accessToken);
    const clearAuthSession = (0, auth_store_1.useAuthStore)((state) => state.clearAuthSession);
    const isAuthenticated = (0, auth_store_1.useAuthStore)((state) => state.isAuthenticated);
    const clearDeliveryRealtimeState = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.clearDeliveryRealtimeState);
    const setConnectionError = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.setConnectionError);
    const setConnectionState = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.setConnectionState);
    const setSocketConnected = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.setSocketConnected);
    const reconnectTimer = (0, react_1.useRef)(null);
    const reconnectAttempts = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        if (!isAuthenticated || !accessToken) {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
            (0, delivery_realtime_socket_service_1.disconnectDeliverySocket)();
            clearDeliveryRealtimeState();
            return undefined;
        }
        setConnectionState('connecting');
        const socket = (0, delivery_realtime_socket_service_1.connectDeliverySocket)(accessToken);
        const handleSocketAuthFailure = async () => {
            const refreshResult = await (0, token_refresh_service_1.refreshDeliveryAccessToken)();
            if (refreshResult.success) {
                return;
            }
            clearDeliveryRealtimeState();
            clearAuthSession();
            (0, delivery_realtime_socket_service_1.disconnectDeliverySocket)();
        };
        const scheduleReconnect = () => {
            if (reconnectTimer.current) {
                return;
            }
            const reconnectConfig = (0, delivery_realtime_socket_service_1.getDeliveryReconnectConfig)();
            if (reconnectAttempts.current >= reconnectConfig.attempts) {
                setConnectionState('failed');
                setConnectionError('Live delivery updates unavailable');
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
            (0, delivery_realtime_socket_service_1.addDeliveryConnectionListener)('connect', () => {
                reconnectAttempts.current = 0;
                setSocketConnected(true);
                setConnectionError(null);
                delivery_realtime_store_1.useDeliveryRealtimeStore
                    .getState()
                    .activeAssignmentRooms.forEach((activeAssignmentId) => (0, delivery_realtime_socket_service_1.joinAssignmentRoom)(activeAssignmentId));
            }),
            (0, delivery_realtime_socket_service_1.addDeliveryConnectionListener)('connect_error', (error) => {
                setSocketConnected(false);
                setConnectionError(toRealtimeConnectionErrorMessage(error));
                if (isRealtimeAuthFailure(error)) {
                    void handleSocketAuthFailure();
                    return;
                }
                scheduleReconnect();
            }),
            (0, delivery_realtime_socket_service_1.addDeliveryConnectionListener)('disconnect', (reason) => {
                setSocketConnected(false);
                setConnectionError(typeof reason === 'string' ? reason : null);
                if (isRealtimeAuthFailure(reason)) {
                    void handleSocketAuthFailure();
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
        clearDeliveryRealtimeState,
        isAuthenticated,
        setConnectionError,
        setConnectionState,
        setSocketConnected,
    ]);
};
exports.useDeliveryRealtimeSocket = useDeliveryRealtimeSocket;
