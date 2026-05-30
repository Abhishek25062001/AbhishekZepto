import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';

import { Types } from 'mongoose';
import { io as createClient, type Socket as SocketClient } from 'socket.io-client';
import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../../modules/realtime-delivery-tracking/constants/delivery-tracking-events.constant';
import { ORDER_STATUS } from '../../modules/orders/constants/order-status.constant';
import * as orderRepository from '../../modules/orders/repositories/order.repository';
import { SOCKET_EVENTS } from '../../modules/realtime/constants/socket-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildOrderSocketRoom } from '../../modules/realtime/utils/socket-room-name.util';
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

const waitForAuthenticatedCustomer = async (
  port: number,
  token: string,
): Promise<SocketClient> => {
  const client = createClient(`http://127.0.0.1:${port}/customer`, {
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

test('customer receives delivery location updates for an authorized order room', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
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
  const client = await waitForAuthenticatedCustomer(port, token);

  try {
    const joined = new Promise<{ roomName?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.ROOM_JOINED, resolve);
    });
    client.emit('customer.join_order_room', { orderId });
    assert.equal((await joined).roomName, buildOrderSocketRoom(orderId));

    const received = new Promise<{ data: { orderId: string } }>((resolve) => {
      client.once(
        DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED,
        resolve,
      );
    });
    getSocketServer()
      .of('/customer')
      .to(buildOrderSocketRoom(orderId))
      .emit(DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED, {
        data: { orderId },
      });

    assert.equal((await received).data.orderId, orderId);
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
