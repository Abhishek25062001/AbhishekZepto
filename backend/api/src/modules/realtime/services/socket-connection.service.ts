import { REALTIME_EVENTS } from '../constants/realtime-events.constant';
import type { AuthenticatedSocket } from '../types/socket.types';

export const handleConnection = (socket: AuthenticatedSocket): void => {
  console.log('Socket connected', {
    socketId: socket.id,
    userId: socket.data.userId,
    role: socket.data.role,
    namespace: socket.nsp.name,
  });

  socket.emit(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, {
    socketId: socket.id,
    userId: socket.data.userId,
    role: socket.data.role,
    namespace: socket.nsp.name,
  });
};

export const handleDisconnect = (
  socket: AuthenticatedSocket,
  reason: string,
): void => {
  console.log('Socket disconnected', {
    socketId: socket.id,
    userId: socket.data.userId,
    role: socket.data.role,
    namespace: socket.nsp.name,
    reason,
    disconnectedAt: new Date().toISOString(),
  });
};
