import { useEffect, useRef } from 'react';

import { refreshAdminAccessToken } from '../../../services/auth/token-refresh.service';
import { useAuthStore } from '../../../store/auth.store';
import {
  addAdminConnectionListener,
  connectAdminSocket,
  disconnectAdminSocket,
  getAdminReconnectConfig,
  joinCityRoom,
} from '../services/admin-realtime-socket.service';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';

const toAdminRealtimeConnectionErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Live control tower updates failed';
};

const isAdminRealtimeAuthFailure = (error: unknown): boolean => {
  const message = toAdminRealtimeConnectionErrorMessage(error).toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('invalid_socket_token') ||
    message.includes('invalid token') ||
    message.includes('auth')
  );
};

export const useAdminRealtimeSocket = (): void => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAdminRealtimeState = useAdminRealtimeStore(
    (state) => state.clearAdminRealtimeState,
  );
  const setConnectionError = useAdminRealtimeStore(
    (state) => state.setConnectionError,
  );
  const setConnectionState = useAdminRealtimeStore(
    (state) => state.setConnectionState,
  );
  const setSocketConnected = useAdminRealtimeStore(
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
      disconnectAdminSocket();
      clearAdminRealtimeState();
      return undefined;
    }

    setConnectionState('connecting');
    const socket = connectAdminSocket(accessToken);

    const handleSocketAuthFailure = async (): Promise<void> => {
      const refreshResult = await refreshAdminAccessToken();
      if (refreshResult.success) {
        return;
      }

      clearAdminRealtimeState();
      clearAuthSession();
      disconnectAdminSocket();
    };

    const scheduleReconnect = (): void => {
      if (reconnectTimer.current) {
        return;
      }

      const reconnectConfig = getAdminReconnectConfig();
      if (reconnectAttempts.current >= reconnectConfig.attempts) {
        setConnectionState('failed');
        setConnectionError('Live control tower updates unavailable');
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
      addAdminConnectionListener('connect', () => {
        reconnectAttempts.current = 0;
        setSocketConnected(true);
        setConnectionError(null);
        useAdminRealtimeStore
          .getState()
          .activeCityRooms.forEach((activeCityId) => joinCityRoom(activeCityId));
      }),
      addAdminConnectionListener('connect_error', (error) => {
        setSocketConnected(false);
        setConnectionError(toAdminRealtimeConnectionErrorMessage(error));
        if (isAdminRealtimeAuthFailure(error)) {
          void handleSocketAuthFailure();
          return;
        }
        scheduleReconnect();
      }),
      addAdminConnectionListener('disconnect', (reason) => {
        setSocketConnected(false);
        setConnectionError(typeof reason === 'string' ? reason : null);
        if (isAdminRealtimeAuthFailure(reason)) {
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
    clearAdminRealtimeState,
    clearAuthSession,
    isAuthenticated,
    setConnectionError,
    setConnectionState,
    setSocketConnected,
  ]);
};
