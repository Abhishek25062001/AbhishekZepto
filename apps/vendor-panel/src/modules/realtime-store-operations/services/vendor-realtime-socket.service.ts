import { io, type Socket } from 'socket.io-client';

import {
  VENDOR_SOCKET_BASE_URL,
  VENDOR_SOCKET_RECONNECT_ATTEMPTS,
  VENDOR_SOCKET_RECONNECT_DELAY_MS,
} from '../../../config/env';
import type {
  VendorRealtimeEventName,
  VendorRealtimeSocketPayload,
} from '../types/vendor-realtime.types';

const VENDOR_JOIN_ORDER_ROOM_EVENT = 'vendor.join_order_room';
const VENDOR_LEAVE_ORDER_ROOM_EVENT = 'vendor.leave_order_room';

let vendorSocket: Socket | null = null;
let activeToken: string | null = null;

export const getVendorRealtimeSocket = (): Socket | null => vendorSocket;

export const connectVendorSocket = (accessToken: string): Socket => {
  if (vendorSocket && activeToken === accessToken) {
    if (!vendorSocket.connected) {
      vendorSocket.connect();
    }
    return vendorSocket;
  }

  disconnectVendorSocket();
  activeToken = accessToken;
  vendorSocket = io(VENDOR_SOCKET_BASE_URL, {
    auth: { token: accessToken },
    reconnection: false,
    timeout: VENDOR_SOCKET_RECONNECT_DELAY_MS,
    transports: ['websocket'],
  });

  return vendorSocket;
};

export const disconnectVendorSocket = (): void => {
  if (!vendorSocket) {
    activeToken = null;
    return;
  }

  vendorSocket.removeAllListeners();
  vendorSocket.disconnect();
  vendorSocket = null;
  activeToken = null;
};

export const joinOrderRoom = (orderId: string): void => {
  const trimmedOrderId = orderId.trim();
  if (!vendorSocket || !trimmedOrderId) {
    return;
  }

  vendorSocket.emit(VENDOR_JOIN_ORDER_ROOM_EVENT, { orderId: trimmedOrderId });
};

export const leaveOrderRoom = (orderId: string): void => {
  const trimmedOrderId = orderId.trim();
  if (!vendorSocket || !trimmedOrderId) {
    return;
  }

  vendorSocket.emit(VENDOR_LEAVE_ORDER_ROOM_EVENT, { orderId: trimmedOrderId });
};

export const addVendorSocketListener = <TPayload = unknown>(
  eventName: VendorRealtimeEventName | string,
  listener: (payload: VendorRealtimeSocketPayload<TPayload>) => void,
): (() => void) => {
  if (!vendorSocket) {
    return () => undefined;
  }

  vendorSocket.on(eventName, listener);
  return () => {
    vendorSocket?.off(eventName, listener);
  };
};

export const addVendorConnectionListener = (
  eventName:
    | 'connect'
    | 'connect_error'
    | 'disconnect'
    | 'error'
    | 'reconnect_attempt',
  listener: (...args: unknown[]) => void,
): (() => void) => {
  if (!vendorSocket) {
    return () => undefined;
  }

  vendorSocket.on(eventName, listener);
  return () => {
    vendorSocket?.off(eventName, listener);
  };
};

export const getVendorReconnectConfig = () => ({
  attempts: VENDOR_SOCKET_RECONNECT_ATTEMPTS,
  delayMs: VENDOR_SOCKET_RECONNECT_DELAY_MS,
});

