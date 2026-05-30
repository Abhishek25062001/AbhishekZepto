import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { io as createClient, type Socket as SocketClient } from 'socket.io-client';
import { ORDER_REALTIME_EVENTS } from '../../modules/realtime-order-updates/constants/order-realtime-events.constant';
import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import { SOCKET_EVENTS } from '../../modules/realtime/constants/socket-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildCityRoom } from '../../modules/realtime/utils/realtime-room.util';
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

const waitForAuthenticated = async (
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

test('city-scoped admin receives order updates for assigned city room', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const cityId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({ role: 'operations_admin', cityId });
  const client = await waitForAuthenticated(port, token);

  try {
    const received = new Promise<{ data: { cityId: string } }>((resolve) => {
      client.once(ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED, resolve);
    });
    getSocketServer()
      .of('/admin')
      .to(buildCityRoom(cityId))
      .emit(ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED, {
        data: { cityId },
      });

    assert.equal((await received).data.cityId, cityId);
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});

test('super admin can join arbitrary city room for order updates', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const cityId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({ role: 'super_admin' });
  const client = await waitForAuthenticated(port, token);

  try {
    const joined = new Promise<{ roomName?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.ROOM_JOINED, resolve);
    });
    client.emit('admin.join_city_room', { cityId });
    assert.equal((await joined).roomName, buildCityRoom(cityId));

    const received = new Promise<{ data: { cityId: string } }>((resolve) => {
      client.once(ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED, resolve);
    });
    getSocketServer()
      .of('/admin')
      .to(buildCityRoom(cityId))
      .emit(ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED, {
        data: { cityId },
      });

    assert.equal((await received).data.cityId, cityId);
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});

test('non-super admin cannot join arbitrary city room', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const { token } = createRealtimeTestToken({ role: 'operations_admin' });
  const client = await waitForAuthenticated(port, token);

  try {
    const denied = new Promise<{ code?: string; message?: string }>((resolve) => {
      client.once(SOCKET_EVENTS.CONNECTION_ERROR, resolve);
    });
    client.emit('admin.join_city_room', { cityId: new Types.ObjectId().toString() });

    const payload = await denied;
    assert.equal(payload.code, SOCKET_ERROR_CODES.ROOM_JOIN_DENIED);
    assert.equal(payload.message, 'City room access denied');
  } finally {
    client.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
