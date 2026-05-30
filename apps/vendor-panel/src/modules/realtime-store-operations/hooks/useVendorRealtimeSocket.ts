import { useEffect, useRef } from 'react';

import { refreshVendorAccessToken } from '../../../services/auth/token-refresh.service';
import { useAuthStore } from '../../../store/auth.store';
import {
  addVendorConnectionListener,
  connectVendorSocket,
  disconnectVendorSocket,
  getVendorReconnectConfig,
  joinOrderRoom,
} from '../services/vendor-realtime-socket.service';
import { useVendorRealtimeStore } from '../store/vendor-realtime.store';

const toRealtimeConnectionErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Live store updates failed';
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

export const useVendorRealtimeSocket = (): void => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearVendorRealtimeState = useVendorRealtimeStore(
    (state) => state.clearVendorRealtimeState,
  );
  const setConnectionError = useVendorRealtimeStore(
    (state) => state.setConnectionError,
  );
  const setConnectionState = useVendorRealtimeStore(
    (state) => state.setConnectionState,
  );
  const setSocketConnected = useVendorRealtimeStore(
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
      disconnectVendorSocket();
      clearVendorRealtimeState();
      return undefined;
    }

    setConnectionState('connecting');
    const socket = connectVendorSocket(accessToken);
    const handleSocketAuthFailure = async (): Promise<void> => {
      const refreshResult = await refreshVendorAccessToken();
      if (refreshResult.success) {
        return;
      }

      clearVendorRealtimeState();
      clearAuthSession();
      disconnectVendorSocket();
    };

    const scheduleReconnect = (): void => {
      if (reconnectTimer.current) {
        return;
      }

      const reconnectConfig = getVendorReconnectConfig();
      if (reconnectAttempts.current >= reconnectConfig.attempts) {
        setConnectionState('failed');
        setConnectionError('Live store updates unavailable');
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
      addVendorConnectionListener('connect', () => {
        reconnectAttempts.current = 0;
        setSocketConnected(true);
        setConnectionError(null);
        useVendorRealtimeStore
          .getState()
          .activeOrderRooms.forEach((activeOrderId) => joinOrderRoom(activeOrderId));
      }),
      addVendorConnectionListener('connect_error', (error) => {
        setSocketConnected(false);
        setConnectionError(toRealtimeConnectionErrorMessage(error));
        if (isRealtimeAuthFailure(error)) {
          void handleSocketAuthFailure();
          return;
        }
        scheduleReconnect();
      }),
      addVendorConnectionListener('disconnect', (reason) => {
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
    clearVendorRealtimeState,
    isAuthenticated,
    setConnectionError,
    setConnectionState,
    setSocketConnected,
  ]);
};
