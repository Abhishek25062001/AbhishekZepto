import type { Namespace } from 'socket.io';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import {
  handleConnection,
  handleDisconnect,
} from '../services/socket-connection.service';
import type { AuthenticatedSocket } from '../types/socket.types';

export const registerSocketRootGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    handleConnection(socket);

    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });
  });
};
