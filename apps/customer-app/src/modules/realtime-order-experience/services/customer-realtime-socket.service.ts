import { io, type Socket } from 'socket.io-client';

import {
  CUSTOMER_SOCKET_BASE_URL,
  CUSTOMER_SOCKET_RECONNECT_ATTEMPTS,
  CUSTOMER_SOCKET_RECONNECT_DELAY_MS,
} from '../../../config/env';
import type {
  CustomerRealtimeEventName,
  RealtimeSocketPayload,
} from '../types/realtime-order.types';

const CUSTOMER_JOIN_ORDER_ROOM_EVENT = 'customer.join_order_room';
const CUSTOMER_LEAVE_ORDER_ROOM_EVENT = 'customer.leave_order_room';

let customerSocket: Socket | null = null;
let activeToken: string | null = null;

export const getCustomerRealtimeSocket = (): Socket | null => customerSocket;

export const connectSocket = (accessToken: string): Socket => {
  if (customerSocket && activeToken === accessToken) {
    if (!customerSocket.connected) {
      customerSocket.connect();
    }
    return customerSocket;
  }

  disconnectSocket();
  activeToken = accessToken;
  customerSocket = io(CUSTOMER_SOCKET_BASE_URL, {
    auth: { token: accessToken },
    reconnection: false,
    timeout: CUSTOMER_SOCKET_RECONNECT_DELAY_MS,
    transports: ['websocket'],
  });

  return customerSocket;
};

export const disconnectSocket = (): void => {
  if (!customerSocket) {
    activeToken = null;
    return;
  }

  customerSocket.removeAllListeners();
  customerSocket.disconnect();
  customerSocket = null;
  activeToken = null;
};

export const joinOrderRoom = (orderId: string): void => {
  const trimmedOrderId = orderId.trim();
  if (!customerSocket || !trimmedOrderId) {
    return;
  }

  customerSocket.emit(CUSTOMER_JOIN_ORDER_ROOM_EVENT, { orderId: trimmedOrderId });
};

export const leaveOrderRoom = (orderId: string): void => {
  const trimmedOrderId = orderId.trim();
  if (!customerSocket || !trimmedOrderId) {
    return;
  }

  customerSocket.emit(CUSTOMER_LEAVE_ORDER_ROOM_EVENT, { orderId: trimmedOrderId });
};

export const addSocketListener = <TPayload = unknown>(
  eventName: CustomerRealtimeEventName | string,
  listener: (payload: RealtimeSocketPayload<TPayload>) => void,
): (() => void) => {
  if (!customerSocket) {
    return () => undefined;
  }

  customerSocket.on(eventName, listener);
  return () => {
    customerSocket?.off(eventName, listener);
  };
};

export const addConnectionListener = (
  eventName:
    | 'connect'
    | 'connect_error'
    | 'disconnect'
    | 'error'
    | 'reconnect_attempt',
  listener: (...args: unknown[]) => void,
): (() => void) => {
  if (!customerSocket) {
    return () => undefined;
  }

  customerSocket.on(eventName, listener);
  return () => {
    customerSocket?.off(eventName, listener);
  };
};

export const getReconnectConfig = () => ({
  attempts: CUSTOMER_SOCKET_RECONNECT_ATTEMPTS,
  delayMs: CUSTOMER_SOCKET_RECONNECT_DELAY_MS,
});
