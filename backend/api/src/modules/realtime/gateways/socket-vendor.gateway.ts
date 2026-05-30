import type { Namespace } from 'socket.io';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import type { AuthRole } from '../../auth/types/auth-role.types';
import { findOrderByIdForStore } from '../../orders/repositories/order.repository';
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
  buildOrderSocketRoom,
  buildVendorSocketRoom,
} from '../utils/socket-room-name.util';

const VENDOR_SOCKET_ROLES = new Set<AuthRole>([
  AUTH_ROLE.VENDOR_OWNER,
  AUTH_ROLE.STORE_MANAGER,
  AUTH_ROLE.STORE_STAFF,
]);

const isJoinOrderPayload = (payload: unknown): payload is { orderId: string } => {
  return (
    Boolean(payload) &&
    typeof payload === 'object' &&
    typeof (payload as { orderId?: unknown }).orderId === 'string' &&
    Boolean((payload as { orderId: string }).orderId.trim())
  );
};

const emitJoinDenied = (socket: AuthenticatedSocket, message: string): void => {
  socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
    code: SOCKET_ERROR_CODES.ROOM_JOIN_DENIED,
    message,
  });
};

const joinOrderRoomForVendor = async (
  socket: AuthenticatedSocket,
  payload: unknown,
): Promise<void> => {
  if (!isJoinOrderPayload(payload)) {
    emitJoinDenied(socket, 'orderId is required');
    return;
  }

  const orderId = payload.orderId.trim();
  const order = await findOrderByIdForStore(orderId, socket.data.storeId);
  if (!order) {
    emitJoinDenied(socket, 'Order room access denied');
    return;
  }

  const roomName = await joinRoom(socket, buildOrderSocketRoom(orderId));
  socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomName });
};

export const registerSocketVendorGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    if (!VENDOR_SOCKET_ROLES.has(socket.data.role) || !socket.data.storeId) {
      socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
        code: SOCKET_ERROR_CODES.SOCKET_FORBIDDEN,
        message: 'Vendor namespace requires vendor store scope',
      });
      socket.disconnect(true);
      return;
    }

    void joinRoom(socket, buildVendorSocketRoom(socket.data.storeId));
    handleConnection(socket);

    socket.on('vendor.join_order_room', (payload: unknown) => {
      void joinOrderRoomForVendor(socket, payload);
    });

    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });
  });
};
