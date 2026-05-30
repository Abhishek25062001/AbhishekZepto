import type { Namespace } from 'socket.io';
import { REALTIME_EVENTS } from '../constants/realtime-events.constant';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import { joinVendorRoom } from '../services/socket-room.service';
import { SOCKET_USER_ROLE, type AuthenticatedSocket } from '../types/realtime.types';

export const registerVendorGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user;

    if (!user || user.socketRole !== SOCKET_USER_ROLE.VENDOR || !user.storeId) {
      socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
        message: 'Vendor namespace requires vendor store scope',
      });
      socket.disconnect(true);
      return;
    }

    void joinVendorRoom(socket, user.storeId);
    socket.emit(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, {
      userId: user.userId,
      namespace: socket.nsp.name,
      storeId: user.storeId,
    });
  });
};
