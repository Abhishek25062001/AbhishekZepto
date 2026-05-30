import type { Namespace } from 'socket.io';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
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
  buildAssignmentSocketRoom,
  buildDeliverySocketRoom,
} from '../utils/socket-room-name.util';

const isJoinAssignmentPayload = (
  payload: unknown,
): payload is { assignmentId: string } => {
  return (
    Boolean(payload) &&
    typeof payload === 'object' &&
    typeof (payload as { assignmentId?: unknown }).assignmentId === 'string' &&
    Boolean((payload as { assignmentId: string }).assignmentId.trim())
  );
};

const emitJoinDenied = (socket: AuthenticatedSocket, message: string): void => {
  socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
    code: SOCKET_ERROR_CODES.ROOM_JOIN_DENIED,
    message,
  });
};

const joinAssignmentRoomForDelivery = async (
  socket: AuthenticatedSocket,
  payload: unknown,
): Promise<void> => {
  if (!isJoinAssignmentPayload(payload)) {
    emitJoinDenied(socket, 'assignmentId is required');
    return;
  }

  const roomName = await joinRoom(
    socket,
    buildAssignmentSocketRoom(payload.assignmentId.trim()),
  );
  socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomName });
};

export const registerSocketDeliveryGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.data.role !== AUTH_ROLE.DELIVERY_AGENT) {
      socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
        code: SOCKET_ERROR_CODES.SOCKET_FORBIDDEN,
        message: 'Delivery namespace requires delivery agent role',
      });
      socket.disconnect(true);
      return;
    }

    void joinRoom(socket, buildDeliverySocketRoom(socket.data.userId));
    handleConnection(socket);

    socket.on('delivery.join_assignment_room', (payload: unknown) => {
      void joinAssignmentRoomForDelivery(socket, payload);
    });

    socket.on('delivery.join_assignment', (payload: unknown) => {
      void joinAssignmentRoomForDelivery(socket, payload);
    });

    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });
  });
};
