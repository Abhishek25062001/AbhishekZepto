import type { Namespace } from 'socket.io';
import { REALTIME_EVENTS } from '../constants/realtime-events.constant';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import {
  joinAssignmentRoom,
  joinDeliveryRoom,
} from '../services/socket-room.service';
import { SOCKET_USER_ROLE, type AuthenticatedSocket } from '../types/realtime.types';

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

export const registerDeliveryGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user;

    if (!user || user.socketRole !== SOCKET_USER_ROLE.DELIVERY_AGENT) {
      socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
        message: 'Delivery namespace requires delivery agent role',
      });
      socket.disconnect(true);
      return;
    }

    void joinDeliveryRoom(socket, user.userId);
    socket.emit(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, {
      userId: user.userId,
      namespace: socket.nsp.name,
    });

    socket.on('delivery.join_assignment', (payload: unknown) => {
      if (!isJoinAssignmentPayload(payload)) {
        socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
          message: 'assignmentId is required',
        });
        return;
      }

      void joinAssignmentRoom(socket, payload.assignmentId.trim());
    });
  });
};
