import { io, type Socket } from 'socket.io-client';

import {
  DELIVERY_SOCKET_BASE_URL,
  DELIVERY_SOCKET_RECONNECT_ATTEMPTS,
  DELIVERY_SOCKET_RECONNECT_DELAY_MS,
} from '../../../config/env';
import type {
  DeliveryRealtimeEventName,
  DeliveryRealtimeSocketPayload,
} from '../types/delivery-realtime.types';

const DELIVERY_JOIN_ASSIGNMENT_ROOM_EVENT = 'delivery.join_assignment_room';
const DELIVERY_LEAVE_ASSIGNMENT_ROOM_EVENT = 'delivery.leave_assignment_room';

let deliverySocket: Socket | null = null;
let activeToken: string | null = null;

export const getDeliveryRealtimeSocket = (): Socket | null => deliverySocket;

export const connectDeliverySocket = (accessToken: string): Socket => {
  if (deliverySocket && activeToken === accessToken) {
    if (!deliverySocket.connected) {
      deliverySocket.connect();
    }
    return deliverySocket;
  }

  disconnectDeliverySocket();
  activeToken = accessToken;
  deliverySocket = io(DELIVERY_SOCKET_BASE_URL, {
    auth: { token: accessToken },
    reconnection: false,
    timeout: DELIVERY_SOCKET_RECONNECT_DELAY_MS,
    transports: ['websocket'],
  });

  return deliverySocket;
};

export const disconnectDeliverySocket = (): void => {
  if (!deliverySocket) {
    activeToken = null;
    return;
  }

  deliverySocket.removeAllListeners();
  deliverySocket.disconnect();
  deliverySocket = null;
  activeToken = null;
};

export const joinAssignmentRoom = (assignmentId: string): void => {
  const trimmedAssignmentId = assignmentId.trim();
  if (!deliverySocket || !trimmedAssignmentId) {
    return;
  }

  deliverySocket.emit(DELIVERY_JOIN_ASSIGNMENT_ROOM_EVENT, {
    assignmentId: trimmedAssignmentId,
  });
};

export const leaveAssignmentRoom = (assignmentId: string): void => {
  const trimmedAssignmentId = assignmentId.trim();
  if (!deliverySocket || !trimmedAssignmentId) {
    return;
  }

  deliverySocket.emit(DELIVERY_LEAVE_ASSIGNMENT_ROOM_EVENT, {
    assignmentId: trimmedAssignmentId,
  });
};

export const addDeliverySocketListener = <TPayload = unknown>(
  eventName: DeliveryRealtimeEventName | string,
  listener: (payload: DeliveryRealtimeSocketPayload<TPayload>) => void,
): (() => void) => {
  if (!deliverySocket) {
    return () => undefined;
  }

  deliverySocket.on(eventName, listener);
  return () => {
    deliverySocket?.off(eventName, listener);
  };
};

export const addDeliveryConnectionListener = (
  eventName:
    | 'connect'
    | 'connect_error'
    | 'disconnect'
    | 'error'
    | 'reconnect_attempt',
  listener: (...args: unknown[]) => void,
): (() => void) => {
  if (!deliverySocket) {
    return () => undefined;
  }

  deliverySocket.on(eventName, listener);
  return () => {
    deliverySocket?.off(eventName, listener);
  };
};

export const getDeliveryReconnectConfig = () => ({
  attempts: DELIVERY_SOCKET_RECONNECT_ATTEMPTS,
  delayMs: DELIVERY_SOCKET_RECONNECT_DELAY_MS,
});
