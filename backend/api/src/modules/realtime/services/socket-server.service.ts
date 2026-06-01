import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { configureSocketRedisAdapter } from '../adapters/socket-redis.adapter';
import { getSocketConfig } from '../config/socket.config';
import { REALTIME_NAMESPACE } from '../constants/realtime-events.constant';
import { registerSocketAdminGateway } from '../gateways/socket-admin.gateway';
import { registerSocketAdminControlGateway } from '../gateways/socket-admin-control.gateway';
import { registerSocketCustomerGateway } from '../gateways/socket-customer.gateway';
import { registerSocketDeliveryGateway } from '../gateways/socket-delivery.gateway';
import { registerSocketRootGateway } from '../gateways/socket-root.gateway';
import { registerSocketVendorGateway } from '../gateways/socket-vendor.gateway';
import type { RealtimeServer } from '../types/realtime.types';

let socketServer: RealtimeServer | null = null;

export const initializeSocketServer = (httpServer: HttpServer): RealtimeServer => {
  if (socketServer) {
    return socketServer;
  }

  const socketConfig = getSocketConfig();
  socketServer = new Server(httpServer, {
    cors: {
      origin: socketConfig.corsOrigins,
      credentials: true,
    },
    pingTimeout: socketConfig.pingTimeout,
    pingInterval: socketConfig.pingInterval,
    transports: ['websocket', 'polling'],
  });

  configureSocketRedisAdapter(socketServer);

  registerSocketRootGateway(socketServer.of('/'));
  registerSocketCustomerGateway(socketServer.of(REALTIME_NAMESPACE.CUSTOMER));
  registerSocketDeliveryGateway(socketServer.of(REALTIME_NAMESPACE.DELIVERY));
  registerSocketVendorGateway(socketServer.of(REALTIME_NAMESPACE.VENDOR));
  registerSocketAdminGateway(socketServer.of(REALTIME_NAMESPACE.ADMIN));
  registerSocketAdminControlGateway(socketServer.of(REALTIME_NAMESPACE.ADMIN_CONTROL));

  return socketServer;
};

export const getSocketServer = (): RealtimeServer => {
  if (!socketServer) {
    throw new Error('Socket server has not been initialized');
  }

  return socketServer;
};

export const closeSocketServer = async (): Promise<void> => {
  if (!socketServer) {
    return;
  }

  await new Promise<void>((resolve) => {
    socketServer?.close(() => resolve());
  });
  socketServer = null;
};
