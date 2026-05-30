import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';

import { Types } from 'mongoose';
import { io as createClient, type Socket as SocketClient } from 'socket.io-client';
import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../../modules/realtime-delivery-tracking/constants/delivery-tracking-events.constant';
import * as orderRepository from '../../modules/orders/repositories/order.repository';
import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import { SOCKET_EVENTS } from '../../modules/realtime/constants/socket-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import {
  buildCitySocketRoom,
  buildOrderSocketRoom,
} from '../../modules/realtime/utils/socket-room-name.util';
import { createRealtimeTestToken } from './realtime-test-auth.helper';

type MutableOrderRepository = {
  findOrderByIdForCustomer: typeof orderRepository.findOrderByIdForCustomer;
};

const mutableOrderRepository = orderRepository as unknown as MutableOrderRepository;
const originalFindOrderByIdForCustomer = mutableOrderRepository.findOrderByIdForCustomer;

const listen = async (httpServer: HttpServer): Promise<number> => {
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');
  return address.port;
};

const closeHttpServer = async (httpServer: HttpServer): Promise<void> => {
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
};

const waitForAuthenticatedSocket = async (
  port: number,
  namespace: '/admin' | '/customer',
  token: string,
): Promise<SocketClient> => {
  const client = createClient(`http://127.0.0.1:${port}${namespace}`, {
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
  mutableOrderRepository.findOrderByIdForCustomer = originalFindOrderByIdForCustomer;
});

test('customer cannot receive delivery tracking events for a non-owned order room', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const { token } = createRealtimeTestToken({ role: 'customer' });
  const orderId = new Types.ObjectId().toString();
  mutableOrderRepository.findOrderByIdForCustomer = async () => null;
  const client = await waitForAuthenticatedSocket(port, '/customer', token);

  try {
    const denied = new Promise<{ code?: string; message?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.CONNECTION_ERROR, resolve);
    });
    client.emit('customer.join_order_room', { orderId });

    const deniedPayload = await denied;
    assert.equal(deniedPayload.code, SOCKET_ERROR_CODES.ROOM_JOIN_DENIED);
    assert.equal(deniedPayload.message, 'Order room access denied');

    const received = Promise.race([
      new Promise<boolean>((resolve) => {
        client.once(
          DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED,
          () => resolve(true),
        );
      }),
      new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 100);
      }),
    ]);
    getSocketServer()
      .of('/customer')
      .to(buildOrderSocketRoom(orderId))
      .emit(DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED, {
        data: { orderId },
      });

    assert.equal(await received, false);
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});

test('city-scoped admin cannot join another delivery city room', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const assignedCityId = new Types.ObjectId().toString();
  const otherCityId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({
    role: 'support_admin',
    cityId: assignedCityId,
  });
  const client = await waitForAuthenticatedSocket(port, '/admin', token);

  try {
    const denied = new Promise<{ code?: string; message?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.CONNECTION_ERROR, resolve);
    });
    client.emit('admin.join_delivery_city_room', { cityId: otherCityId });

    const payload = await denied;
    assert.equal(payload.code, SOCKET_ERROR_CODES.ROOM_JOIN_DENIED);
    assert.equal(payload.message, 'Delivery city room access denied');

    getSocketServer()
      .of('/admin')
      .to(buildCitySocketRoom(otherCityId))
      .emit(DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED, {
        data: { cityId: otherCityId },
      });
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
