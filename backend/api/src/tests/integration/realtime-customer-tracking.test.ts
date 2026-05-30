import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { io as createClient } from 'socket.io-client';
import { ORDER_STATUS } from '../../modules/orders/constants/order-status.constant';
import * as orderRepository from '../../modules/orders/repositories/order.repository';
import { REALTIME_EVENTS } from '../../modules/realtime/constants/realtime-events.constant';
import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildOrderRoom } from '../../modules/realtime/utils/realtime-room.util';
import { createRealtimeTestToken } from './realtime-test-auth.helper';

type MutableOrderRepository = {
  findOrderByIdForCustomer: typeof orderRepository.findOrderByIdForCustomer;
};

const mutableOrderRepository = orderRepository as unknown as MutableOrderRepository;
const originalFindOrderByIdForCustomer = mutableOrderRepository.findOrderByIdForCustomer;

test.afterEach(() => {
  mutableOrderRepository.findOrderByIdForCustomer = originalFindOrderByIdForCustomer;
});

test('customer socket authenticates, joins order room, and receives tracking event', async () => {
  const httpServer = createServer();
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  initializeSocketServer(httpServer);

  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');

  const { token, userId } = createRealtimeTestToken({ role: 'customer' });
  const orderId = new Types.ObjectId().toString();
  mutableOrderRepository.findOrderByIdForCustomer = async (requestedOrderId, customerId) => {
    if (requestedOrderId !== orderId || customerId !== userId) {
      return null;
    }

    return {
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(userId),
      storeId: new Types.ObjectId(),
      orderStatus: ORDER_STATUS.SHIPPED,
    } as never;
  };
  const client = createClient(`http://127.0.0.1:${address.port}/customer`, {
    auth: { token },
    transports: ['websocket'],
  });

  await new Promise<void>((resolve, reject) => {
    client.once(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, (payload: { userId: string }) => {
      try {
        assert.equal(payload.userId, userId);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    client.once('connect_error', reject);
  });

  client.emit('customer.track_order', { orderId });
  await new Promise((resolve) => {
    setTimeout(resolve, 25);
  });

  const received = Promise.race([
    new Promise<{ data: { orderId: string } }>((resolve) => {
      client.once(REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED, resolve);
    }),
    new Promise<never>((_resolve, reject) => {
      setTimeout(() => reject(new Error('Timed out waiting for customer tracking event')), 1_000);
    }),
  ]);

  getSocketServer()
    .of('/customer')
    .to(buildOrderRoom(orderId))
    .emit(REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED, {
      data: { orderId },
    });

  const payload = await received;
  assert.equal(payload.data.orderId, orderId);

  client.disconnect();
  await closeSocketServer();
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
});

test('customer socket denies order room access for non-owned orders', async () => {
  const httpServer = createServer();
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  initializeSocketServer(httpServer);

  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');

  const { token } = createRealtimeTestToken({ role: 'customer' });
  mutableOrderRepository.findOrderByIdForCustomer = async () => null;
  const client = createClient(`http://127.0.0.1:${address.port}/customer`, {
    auth: { token },
    transports: ['websocket'],
  });

  await new Promise<void>((resolve, reject) => {
    client.once(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, () => resolve());
    client.once('connect_error', reject);
  });

  const denied = new Promise<{ code?: string; message?: string }>((resolve) => {
    client.once(REALTIME_EVENTS.CONNECTION_ERROR, resolve);
  });
  client.emit('customer.join_order_room', { orderId: new Types.ObjectId().toString() });

  const payload = await denied;
  assert.equal(payload.code, SOCKET_ERROR_CODES.ROOM_JOIN_DENIED);
  assert.equal(payload.message, 'Order room access denied');

  client.disconnect();
  await closeSocketServer();
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
});
