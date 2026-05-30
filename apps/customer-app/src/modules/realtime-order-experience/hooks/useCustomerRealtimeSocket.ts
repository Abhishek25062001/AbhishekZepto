import { useEffect, useRef } from 'react';

import { useAuthStore } from '../../../store/auth.store';
import {
  addConnectionListener,
  connectSocket,
  disconnectSocket,
  getReconnectConfig,
  joinOrderRoom,
} from '../services/customer-realtime-socket.service';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import {
  getRealtimeRoomsToRestore,
  isRealtimeAuthSocketFailure,
  toRealtimeConnectionErrorMessage,
} from '../utils/realtime-connection-state.util';

export const useCustomerRealtimeSocket = (): void => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setSocketConnected = useRealtimeOrderStore((state) => state.setSocketConnected);
  const setConnectionState = useRealtimeOrderStore((state) => state.setConnectionState);
  const setConnectionError = useRealtimeOrderStore((state) => state.setConnectionError);
  const clearRealtimeOrderState = useRealtimeOrderStore(
    (state) => state.clearRealtimeOrderState,
  );
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      disconnectSocket();
      clearRealtimeOrderState();
      return undefined;
    }

    setConnectionState('connecting');
    const socket = connectSocket(accessToken);
    const scheduleReconnect = (): void => {
      if (reconnectTimer.current) {
        return;
      }

      const reconnectConfig = getReconnectConfig();
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
      addConnectionListener('connect', () => {
        reconnectAttempts.current = 0;
        setSocketConnected(true);
        setConnectionError(null);
        getRealtimeRoomsToRestore(
          useRealtimeOrderStore.getState().activeOrderRooms,
        ).forEach((activeOrderId) => joinOrderRoom(activeOrderId));
      }),
      addConnectionListener('connect_error', (error) => {
        setSocketConnected(false);
        setConnectionError(toRealtimeConnectionErrorMessage(error));
        if (isRealtimeAuthSocketFailure(error)) {
          clearRealtimeOrderState();
          clearAuthSession();
          disconnectSocket();
          return;
        }
        scheduleReconnect();
      }),
      addConnectionListener('disconnect', (reason) => {
        setSocketConnected(false);
        setConnectionError(typeof reason === 'string' ? reason : null);
        if (isRealtimeAuthSocketFailure(reason)) {
          clearRealtimeOrderState();
          clearAuthSession();
          disconnectSocket();
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
