import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';

import { Types } from 'mongoose';
import { io as createClient, type Socket as SocketClient } from 'socket.io-client';
import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../../modules/realtime-delivery-tracking/constants/delivery-tracking-events.constant';
import { SOCKET_EVENTS } from '../../modules/realtime/constants/socket-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildCitySocketRoom } from '../../modules/realtime/utils/socket-room-name.util';
import { createRealtimeTestToken } from './realtime-test-auth.helper';

const listen = async (httpServer: HttpServer): Promise<number> => {
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');
  return address.port;
};

const closeHttpServer = async (httpServer: HttpServer): Promise<void> => {
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
};

const waitForAuthenticatedAdmin = async (
  port: number,
  token: string,
): Promise<SocketClient> => {
  const client = createClient(`http://127.0.0.1:${port}/admin`, {
    auth: { token },
    transports: ['websocket'],
  });

  await new Promise<void>((resolve, reject) => {
    client.once(SOCKET_EVENTS.CONNECTION_AUTHENTICATED, () => resolve());
    client.once('connect_error', reject);
  });

  return client;
};

test('city-scoped admin receives delivery tracking events for assigned city room', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const cityId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({ role: 'operations_admin', cityId });
  const client = await waitForAuthenticatedAdmin(port, token);

  try {
    const joined = new Promise<{ roomName?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.ROOM_JOINED, resolve);
    });
    client.emit('admin.join_delivery_city_room', { cityId });
    assert.equal((await joined).roomName, buildCitySocketRoom(cityId));

    const received = new Promise<{ data: { cityId: string } }>((resolve) => {
      client.once(
        DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED,
        resolve,
      );
    });
    getSocketServer()
      .of('/admin')
      .to(buildCitySocketRoom(cityId))
      .emit(DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED, {
        data: { cityId },
      });

    assert.equal((await received).data.cityId, cityId);
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
