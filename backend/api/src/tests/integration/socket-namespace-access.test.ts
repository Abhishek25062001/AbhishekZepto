import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { io as createClient, type Socket as SocketClient } from 'socket.io-client';
import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import { SOCKET_EVENTS } from '../../modules/realtime/constants/socket-events.constant';
import {
  closeSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
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
  namespace: string,
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

test('socket namespaces accept only role-scoped clients', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  const clients: SocketClient[] = [];

  try {
    const customer = createRealtimeTestToken({ role: 'customer' });
    const forbiddenClient = createClient(`http://127.0.0.1:${port}/delivery`, {
      auth: { token: customer.token },
      transports: ['websocket'],
      reconnection: false,
    });
    clients.push(forbiddenClient);

    const forbiddenPayload = await new Promise<{ code?: string }>((resolve) => {
      forbiddenClient.once(SOCKET_EVENTS.CONNECTION_ERROR, resolve);
    });
    assert.equal(forbiddenPayload.code, SOCKET_ERROR_CODES.SOCKET_FORBIDDEN);

    const delivery = createRealtimeTestToken({ role: 'delivery_agent' });
    clients.push(await waitForAuthenticated(port, '/delivery', delivery.token));

    const storeId = new Types.ObjectId().toString();
    const vendor = createRealtimeTestToken({ role: 'store_manager', storeId });
    clients.push(await waitForAuthenticated(port, '/vendor', vendor.token));

    const cityId = new Types.ObjectId().toString();
    const admin = createRealtimeTestToken({ role: 'operations_admin', cityId });
    clients.push(await waitForAuthenticated(port, '/admin', admin.token));
  } finally {
    for (const client of clients) {
      client.disconnect();
    }
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
