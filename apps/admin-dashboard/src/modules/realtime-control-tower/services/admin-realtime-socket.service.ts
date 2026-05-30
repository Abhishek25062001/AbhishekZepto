import { io, type Socket } from 'socket.io-client';

import {
  ADMIN_SOCKET_BASE_URL,
  ADMIN_SOCKET_RECONNECT_ATTEMPTS,
  ADMIN_SOCKET_RECONNECT_DELAY_MS,
} from '../../../config/env';
import type {
  AdminRealtimeEventName,
  AdminRealtimeSocketPayload,
} from '../types/control-tower-realtime.types';

const ADMIN_JOIN_DELIVERY_CITY_ROOM_EVENT = 'admin.join_delivery_city_room';
const ADMIN_LEAVE_DELIVERY_CITY_ROOM_EVENT = 'admin.leave_delivery_city_room';

let adminSocket: Socket | null = null;
let activeToken: string | null = null;

export const getAdminRealtimeSocket = (): Socket | null => adminSocket;

export const connectAdminSocket = (accessToken: string): Socket => {
  if (adminSocket && activeToken === accessToken) {
    if (!adminSocket.connected) {
      adminSocket.connect();
    }
    return adminSocket;
  }

  disconnectAdminSocket();
  activeToken = accessToken;
  adminSocket = io(ADMIN_SOCKET_BASE_URL, {
    auth: { token: accessToken },
    reconnection: false,
    timeout: ADMIN_SOCKET_RECONNECT_DELAY_MS,
    transports: ['websocket'],
  });

  return adminSocket;
};

export const disconnectAdminSocket = (): void => {
  if (!adminSocket) {
    activeToken = null;
    return;
  }

  adminSocket.removeAllListeners();
  adminSocket.disconnect();
  adminSocket = null;
  activeToken = null;
};

export const joinCityRoom = (cityId: string): void => {
  const trimmedCityId = cityId.trim();
  if (!adminSocket || !trimmedCityId) {
    return;
  }

  adminSocket.emit(ADMIN_JOIN_DELIVERY_CITY_ROOM_EVENT, { cityId: trimmedCityId });
};

export const leaveCityRoom = (cityId: string): void => {
  const trimmedCityId = cityId.trim();
  if (!adminSocket || !trimmedCityId) {
    return;
  }

  adminSocket.emit(ADMIN_LEAVE_DELIVERY_CITY_ROOM_EVENT, { cityId: trimmedCityId });
};

export const addAdminSocketListener = <TPayload = unknown>(
  eventName: AdminRealtimeEventName | string,
  listener: (payload: AdminRealtimeSocketPayload<TPayload>) => void,
): (() => void) => {
  if (!adminSocket) {
    return () => undefined;
  }

  adminSocket.on(eventName, listener);
  return () => {
    adminSocket?.off(eventName, listener);
  };
};

export const addAdminConnectionListener = (
  eventName:
    | 'connect'
    | 'connect_error'
    | 'disconnect'
    | 'error'
    | 'reconnect_attempt',
  listener: (...args: unknown[]) => void,
): (() => void) => {
  if (!adminSocket) {
    return () => undefined;
  }

  adminSocket.on(eventName, listener);
  return () => {
    adminSocket?.off(eventName, listener);
  };
};

export const getAdminReconnectConfig = () => ({
  attempts: ADMIN_SOCKET_RECONNECT_ATTEMPTS,
  delayMs: ADMIN_SOCKET_RECONNECT_DELAY_MS,
});
