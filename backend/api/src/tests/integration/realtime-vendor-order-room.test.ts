import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { io as createClient, type Socket as SocketClient } from 'socket.io-client';
import { ORDER_STATUS } from '../../modules/orders/constants/order-status.constant';
import * as orderRepository from '../../modules/orders/repositories/order.repository';
import { ORDER_REALTIME_EVENTS } from '../../modules/realtime-order-updates/constants/order-realtime-events.constant';
import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import { SOCKET_EVENTS } from '../../modules/realtime/constants/socket-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildOrderRoom } from '../../modules/realtime/utils/realtime-room.util';
import { createRealtimeTestToken } from './realtime-test-auth.helper';

type MutableOrderRepository = {
  findOrderByIdForStore: typeof orderRepository.findOrderByIdForStore;
};

const mutableOrderRepository = orderRepository as unknown as MutableOrderRepository;
const originalFindOrderByIdForStore = mutableOrderRepository.findOrderByIdForStore;

const listen = async (httpServer: HttpServer): Promise<number> => {
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');
  return address.port;
};

const closeHttpServer = async (httpServer: HttpServer): Promise<void> => {
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
};

const waitForAuthenticated = async (
  port: number,
  token: string,
): Promise<SocketClient> => {
  const client = createClient(`http://127.0.0.1:${port}/vendor`, {
    auth: { token },
    transports: ['websocket'],
  });

  await new Promise<void>((resolve, reject) => {
    client.once(SOCKET_EVENTS.CONNECTION_AUTHENTICATED, () => resolve());
    client.once('connect_error', reject);
  });

  return client;
};

test.afterEach(() => {
  mutableOrderRepository.findOrderByIdForStore = originalFindOrderByIdForStore;
});

test('vendor socket joins owned order room and receives order updates', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const storeId = new Types.ObjectId().toString();
  const orderId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({ role: 'store_manager', storeId });

  mutableOrderRepository.findOrderByIdForStore = async (requestedOrderId, requestedStoreId) => {
    if (requestedOrderId !== orderId || requestedStoreId !== storeId) {
      return null;
    }

    return {
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(),
      storeId: new Types.ObjectId(storeId),
      orderStatus: ORDER_STATUS.ACCEPTED,
    } as never;
  };

  const client = await waitForAuthenticated(port, token);

  try {
    const joined = new Promise<{ roomName?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.ROOM_JOINED, resolve);
    });
    client.emit('vendor.join_order_room', { orderId });
    assert.equal((await joined).roomName, buildOrderRoom(orderId));

    const received = new Promise<{ data: { orderId: string } }>((resolve) => {
      client.once(ORDER_REALTIME_EVENTS.VENDOR_ORDER_STATUS_UPDATED, resolve);
    });
    getSocketServer()
      .of('/vendor')
      .to(buildOrderRoom(orderId))
      .emit(ORDER_REALTIME_EVENTS.VENDOR_ORDER_STATUS_UPDATED, {
        data: { orderId },
      });

    assert.equal((await received).data.orderId, orderId);
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});

test('vendor socket denies order room access outside store scope', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const storeId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({ role: 'store_manager', storeId });
  mutableOrderRepository.findOrderByIdForStore = async () => null;
  const client = await waitForAuthenticated(port, token);

  try {
    const denied = new Promise<{ code?: string; message?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.CONNECTION_ERROR, resolve);
    });
    client.emit('vendor.join_order_room', { orderId: new Types.ObjectId().toString() });

    const payload = await denied;
    assert.equal(payload.code, SOCKET_ERROR_CODES.ROOM_JOIN_DENIED);
    assert.equal(payload.message, 'Order room access denied');
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
