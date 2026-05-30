import type { Namespace } from 'socket.io';
import { REALTIME_EVENTS } from '../constants/realtime-events.constant';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import {
  joinCustomerRoom,
  joinOrderRoom,
} from '../services/socket-room.service';
import { SOCKET_USER_ROLE, type AuthenticatedSocket } from '../types/realtime.types';

const isTrackOrderPayload = (payload: unknown): payload is { orderId: string } => {
  return (
    Boolean(payload) &&
    typeof payload === 'object' &&
    typeof (payload as { orderId?: unknown }).orderId === 'string' &&
    Boolean((payload as { orderId: string }).orderId.trim())
  );
};

export const registerCustomerGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user;

    if (!user || user.socketRole !== SOCKET_USER_ROLE.CUSTOMER) {
      socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
        message: 'Customer namespace requires customer role',
      });
      socket.disconnect(true);
      return;
    }

    void joinCustomerRoom(socket, user.userId);
    socket.emit(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, {
      userId: user.userId,
      namespace: socket.nsp.name,
    });

    socket.on('customer.track_order', (payload: unknown) => {
      if (!isTrackOrderPayload(payload)) {
        socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
          message: 'orderId is required',
        });
        return;
      }

      void joinOrderRoom(socket, payload.orderId.trim());
    });
  });
};
