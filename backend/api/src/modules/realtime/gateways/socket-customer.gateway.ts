import type { Namespace } from 'socket.io';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { findOrderByIdForCustomer } from '../../orders/repositories/order.repository';
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
  buildCustomerSocketRoom,
  buildOrderSocketRoom,
} from '../utils/socket-room-name.util';

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

const joinOrderRoomForCustomer = async (
  socket: AuthenticatedSocket,
  payload: unknown,
): Promise<void> => {
  if (!isJoinOrderPayload(payload)) {
    emitJoinDenied(socket, 'orderId is required');
    return;
  }

  const orderId = payload.orderId.trim();
  const order = await findOrderByIdForCustomer(orderId, socket.data.userId);
  if (!order) {
    emitJoinDenied(socket, 'Order room access denied');
    return;
  }

  const roomName = await joinRoom(socket, buildOrderSocketRoom(orderId));
  socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomName });
};

export const registerSocketCustomerGateway = (namespace: Namespace): void => {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.data.role !== AUTH_ROLE.CUSTOMER) {
      socket.emit(SOCKET_EVENTS.CONNECTION_ERROR, {
        code: SOCKET_ERROR_CODES.SOCKET_FORBIDDEN,
        message: 'Customer namespace requires customer role',
      });
      socket.disconnect(true);
      return;
    }

    void joinRoom(socket, buildCustomerSocketRoom(socket.data.userId));
    handleConnection(socket);

    socket.on('customer.join_order_room', (payload: unknown) => {
      void joinOrderRoomForCustomer(socket, payload);
    });

    socket.on('customer.track_order', (payload: unknown) => {
      void joinOrderRoomForCustomer(socket, payload);
    });

    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });
  });
};
