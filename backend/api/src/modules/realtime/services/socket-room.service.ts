import type { Socket } from 'socket.io';
import { createHash } from 'node:crypto';
import { Types } from 'mongoose';
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
import { recordEmitSuccess, recordEmitFailure } from './realtime-health.service';
import { RealtimeEventLogModel } from '../models/realtime-event-log.model';

const buildDeterministicEventId = (
  eventName: string,
  customerId: string,
  payload: Record<string, unknown> | null,
): string => {
  const data = payload?.data && typeof payload.data === 'object'
    ? (payload.data as Record<string, unknown>)
    : {};
  const seed = JSON.stringify({
    eventName,
    customerId,
    orderId: data.orderId ?? null,
    assignmentId: data.assignmentId ?? null,
    orderStatus: data.orderStatus ?? null,
    progressStatus: data.progressStatus ?? null,
    updatedAt: data.updatedAt ?? data.lastLocationUpdatedAt ?? payload?.emittedAt ?? null,
  });

  return createHash('sha256').update(seed).digest('hex');
};

const logEventSafely = async (
  roomName: string,
  eventName: string,
  payload: unknown,
  namespace?: string,
): Promise<void> => {
  try {
    if (namespace !== '/customer') {
      return;
    }

    const payloadObj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
    const dataObj = payloadObj?.data && typeof payloadObj.data === 'object' ? (payloadObj.data as Record<string, unknown>) : null;

    let customerId: string | null = null;

    if (roomName.startsWith('customer:')) {
      customerId = roomName.split(':')[1] || null;
    } else if (dataObj?.customerId) {
      customerId = String(dataObj.customerId);
    }

    if (!customerId) {
      return;
    }

    const eventId = String(
      dataObj?.eventId ||
        payloadObj?.eventId ||
        buildDeterministicEventId(eventName, customerId, payloadObj),
    );

    const exists = await RealtimeEventLogModel.exists({ eventId });
    if (exists) {
      return;
    }

    const emittedAtStr = payloadObj && 'emittedAt' in payloadObj && typeof payloadObj.emittedAt === 'string'
      ? payloadObj.emittedAt
      : null;

    await RealtimeEventLogModel.create({
      eventId,
      eventName,
      recipientUserId: new Types.ObjectId(customerId),
      appSurface: 'customer_app',
      deliveryStatus: 'pending',
      payload: payloadObj ?? {},
      emittedAt: emittedAtStr ? new Date(emittedAtStr) : new Date(),
      acknowledgedAt: null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour TTL
    });
  } catch (err) {
    console.error('Error logging realtime event:', err);
  }
};

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
  try {
    const io = getSocketServer();

    if (namespace) {
      io.of(namespace).to(roomName).emit(eventName, payload);
    } else {
      io.to(roomName).emit(eventName, payload);
    }

    recordEmitSuccess();
    void logEventSafely(roomName, eventName, payload, namespace);
  } catch (error) {
    recordEmitFailure();
    throw error;
  }
};

export const emitToSocket = (
  socketId: string,
  eventName: string,
  payload: RealtimeEventPayload,
): void => {
  try {
    getSocketServer().to(socketId).emit(eventName, payload);
    recordEmitSuccess();
  } catch (error) {
    recordEmitFailure();
    throw error;
  }
};
