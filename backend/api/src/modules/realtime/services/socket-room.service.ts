import type { Socket } from 'socket.io';
import type { RealtimeNamespace } from '../constants/realtime-events.constant';
import type { AuthenticatedSocket, RealtimeEventPayload } from '../types/realtime.types';
import {
  ADMIN_OPERATIONS_ROOM,
  buildAssignmentRoom,
  buildCityRoom,
  buildCustomerRoom,
  buildDeliveryRoom,
  buildOrderRoom,
  buildVendorRoom,
} from '../utils/realtime-room.util';
import { getSocketServer } from './socket-server.service';

export const joinCustomerRoom = async (
  socket: AuthenticatedSocket,
  customerId: string,
): Promise<string> => {
  const roomName = buildCustomerRoom(customerId);
  await socket.join(roomName);
  return roomName;
};

export const joinDeliveryRoom = async (
  socket: AuthenticatedSocket,
  deliveryAgentId: string,
): Promise<string> => {
  const roomName = buildDeliveryRoom(deliveryAgentId);
  await socket.join(roomName);
  return roomName;
};

export const joinVendorRoom = async (
  socket: AuthenticatedSocket,
  storeId: string,
): Promise<string> => {
  const roomName = buildVendorRoom(storeId);
  await socket.join(roomName);
  return roomName;
};

export const joinOrderRoom = async (
  socket: AuthenticatedSocket,
  orderId: string,
): Promise<string> => {
  const roomName = buildOrderRoom(orderId);
  await socket.join(roomName);
  return roomName;
};

export const joinAssignmentRoom = async (
  socket: AuthenticatedSocket,
  assignmentId: string,
): Promise<string> => {
  const roomName = buildAssignmentRoom(assignmentId);
  await socket.join(roomName);
  return roomName;
};

export const joinCityRoom = async (
  socket: AuthenticatedSocket,
  cityId: string,
): Promise<string> => {
  const roomName = buildCityRoom(cityId);
  await socket.join(roomName);
  return roomName;
};

export const joinAdminOperationsRoom = async (
  socket: AuthenticatedSocket,
): Promise<string> => {
  await socket.join(ADMIN_OPERATIONS_ROOM);
  return ADMIN_OPERATIONS_ROOM;
};

export const joinRoom = async (
  socket: Socket,
  roomName: string,
): Promise<string> => {
  await socket.join(roomName);
  return roomName;
};

export const leaveRoom = async (
  socket: Socket,
  roomName: string,
): Promise<void> => {
  await socket.leave(roomName);
};

export const emitToRoom = (
  roomName: string,
  eventName: string,
  payload: RealtimeEventPayload,
  namespace?: RealtimeNamespace,
): void => {
  const io = getSocketServer();

  if (namespace) {
    io.of(namespace).to(roomName).emit(eventName, payload);
    return;
  }

  io.to(roomName).emit(eventName, payload);
};

export const emitToSocket = (
  socketId: string,
  eventName: string,
  payload: RealtimeEventPayload,
): void => {
  getSocketServer().to(socketId).emit(eventName, payload);
};
