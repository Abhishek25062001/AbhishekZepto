import type { Namespace } from 'socket.io';
import { REALTIME_EVENTS } from '../constants/realtime-events.constant';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import {
  joinAdminOperationsRoom,
  joinCityRoom,
} from '../services/socket-room.service';
import { SOCKET_USER_ROLE, type AuthenticatedSocket } from '../types/realtime.types';

export const registerAdminGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user;

    if (!user || user.socketRole !== SOCKET_USER_ROLE.ADMIN) {
      socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
        message: 'Admin namespace requires admin role',
      });
      socket.disconnect(true);
      return;
    }

    if (user.cityId) {
      void joinCityRoom(socket, user.cityId);
    }

    void joinAdminOperationsRoom(socket);
    socket.emit(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, {
      userId: user.userId,
      namespace: socket.nsp.name,
      cityId: user.cityId,
    });
  });
};
