import { useEffect, useRef } from 'react';

import { useAuthStore } from '../../../store/auth.store';
import { refreshDeliveryAccessToken } from '../../../services/auth/token-refresh.service';
import {
  addDeliveryConnectionListener,
  connectDeliverySocket,
  disconnectDeliverySocket,
  getDeliveryReconnectConfig,
  joinAssignmentRoom,
} from '../services/delivery-realtime-socket.service';
import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';

const toRealtimeConnectionErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Delivery live updates failed';
};

const isRealtimeAuthFailure = (error: unknown): boolean => {
  const message = toRealtimeConnectionErrorMessage(error).toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('invalid_socket_token') ||
    message.includes('invalid token') ||
    message.includes('auth')
  );
};

export const useDeliveryRealtimeSocket = (): void => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearDeliveryRealtimeState = useDeliveryRealtimeStore(
    (state) => state.clearDeliveryRealtimeState,
  );
  const setConnectionError = useDeliveryRealtimeStore(
    (state) => state.setConnectionError,
  );
  const setConnectionState = useDeliveryRealtimeStore(
    (state) => state.setConnectionState,
  );
  const setSocketConnected = useDeliveryRealtimeStore(
    (state) => state.setSocketConnected,
  );
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      disconnectDeliverySocket();
      clearDeliveryRealtimeState();
      return undefined;
    }

    setConnectionState('connecting');
    const socket = connectDeliverySocket(accessToken);
    const handleSocketAuthFailure = async (): Promise<void> => {
      const refreshResult = await refreshDeliveryAccessToken();
      if (refreshResult.success) {
        return;
      }

      clearDeliveryRealtimeState();
      clearAuthSession();
      disconnectDeliverySocket();
    };

    const scheduleReconnect = (): void => {
      if (reconnectTimer.current) {
        return;
      }

      const reconnectConfig = getDeliveryReconnectConfig();
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
      addDeliveryConnectionListener('connect', () => {
        reconnectAttempts.current = 0;
        setSocketConnected(true);
        setConnectionError(null);
        useDeliveryRealtimeStore
          .getState()
          .activeAssignmentRooms.forEach((activeAssignmentId) =>
            joinAssignmentRoom(activeAssignmentId),
          );
      }),
      addDeliveryConnectionListener('connect_error', (error) => {
        setSocketConnected(false);
        setConnectionError(toRealtimeConnectionErrorMessage(error));
        if (isRealtimeAuthFailure(error)) {
          void handleSocketAuthFailure();
          return;
        }
        scheduleReconnect();
      }),
      addDeliveryConnectionListener('disconnect', (reason) => {
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
