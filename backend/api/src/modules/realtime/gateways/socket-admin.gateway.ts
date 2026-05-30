import type { Namespace } from 'socket.io';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import type { AuthRole } from '../../auth/types/auth-role.types';
import { SOCKET_ERROR_CODES } from '../constants/socket-error-codes.constant';
import { SOCKET_EVENTS } from '../constants/socket-events.constant';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import {
  handleConnection,
  handleDisconnect,
} from '../services/socket-connection.service';
import { joinRoom } from '../services/socket-room.service';
import type { AuthenticatedSocket } from '../types/socket.types';
import {
  buildAdminSocketRoom,
  buildCitySocketRoom,
} from '../utils/socket-room-name.util';

const ADMIN_SOCKET_ROLES = new Set<AuthRole>([
  AUTH_ROLE.SUPPORT_ADMIN,
  AUTH_ROLE.OPERATIONS_ADMIN,
  AUTH_ROLE.SUPER_ADMIN,
]);

const isJoinCityPayload = (payload: unknown): payload is { cityId: string } => {
  return (
    Boolean(payload) &&
    typeof payload === 'object' &&
    typeof (payload as { cityId?: unknown }).cityId === 'string' &&
    Boolean((payload as { cityId: string }).cityId.trim())
  );
};

const emitJoinDenied = (socket: AuthenticatedSocket, message: string): void => {
  socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
    code: SOCKET_ERROR_CODES.ROOM_JOIN_DENIED,
    message,
  });
};

const joinCityRoomForAdmin = async (
  socket: AuthenticatedSocket,
  payload: unknown,
): Promise<void> => {
  if (!isJoinCityPayload(payload)) {
    emitJoinDenied(socket, 'cityId is required');
    return;
  }

  if (socket.data.role !== AUTH_ROLE.SUPER_ADMIN) {
    emitJoinDenied(socket, 'City room access denied');
    return;
  }

  const roomName = await joinRoom(socket, buildCitySocketRoom(payload.cityId.trim()));
  socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomName });
};

const joinDeliveryCityRoomForAdmin = async (
  socket: AuthenticatedSocket,
  payload: unknown,
): Promise<void> => {
  if (!isJoinCityPayload(payload)) {
    emitJoinDenied(socket, 'cityId is required');
    return;
  }

  const cityId = payload.cityId.trim();
  const canJoinCity =
    socket.data.role === AUTH_ROLE.SUPER_ADMIN ||
    socket.data.cityId === cityId;

  if (!canJoinCity) {
    emitJoinDenied(socket, 'Delivery city room access denied');
    return;
  }

  const roomName = await joinRoom(socket, buildCitySocketRoom(cityId));
  socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomName });
};

export const registerSocketAdminGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    if (!ADMIN_SOCKET_ROLES.has(socket.data.role)) {
      socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
        code: SOCKET_ERROR_CODES.SOCKET_FORBIDDEN,
        message: 'Admin namespace requires admin role',
      });
      socket.disconnect(true);
      return;
    }

    void joinRoom(socket, buildAdminSocketRoom(socket.data.userId));

    if (socket.data.cityId) {
      void joinRoom(socket, buildCitySocketRoom(socket.data.cityId));
    }

    handleConnection(socket);

    socket.on('admin.join_city_room', (payload: unknown) => {
      void joinCityRoomForAdmin(socket, payload);
    });

    socket.on('admin.join_delivery_city_room', (payload: unknown) => {
      void joinDeliveryCityRoomForAdmin(socket, payload);
    });

    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });
  });
};
