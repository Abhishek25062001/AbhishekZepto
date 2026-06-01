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
import {
  joinAdminOperationsRoom,
  joinRoom,
} from '../services/socket-room.service';
import type { AuthenticatedSocket } from '../types/socket.types';
import { buildCityRoom } from '../utils/realtime-room.util';

const ADMIN_CONTROL_SOCKET_ROLES = new Set<AuthRole>([
  AUTH_ROLE.SUPPORT_ADMIN,
  AUTH_ROLE.OPERATIONS_ADMIN,
  AUTH_ROLE.SUPER_ADMIN,
]);

export const registerSocketAdminControlGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    if (!ADMIN_CONTROL_SOCKET_ROLES.has(socket.data.role)) {
      socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
        code: SOCKET_ERROR_CODES.SOCKET_FORBIDDEN,
        message: 'Admin Control namespace requires admin role',
      });
      socket.disconnect(true);
      return;
    }

    void joinAdminOperationsRoom(socket);

    if (socket.data.cityId) {
      void joinRoom(socket, buildCityRoom(socket.data.cityId));
    }

    handleConnection(socket);

    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });
  });
};
