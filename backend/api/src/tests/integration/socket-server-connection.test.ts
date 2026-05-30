import assert from 'node:assert/strict';
import { createServer, type Server as HttpServer } from 'node:http';
import { test } from 'node:test';
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

test('root socket authenticates and emits connection acknowledgement', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  let client: SocketClient | undefined;

  try {
    const { token, userId } = createRealtimeTestToken({ role: 'customer' });
    client = createClient(`http://127.0.0.1:${port}`, {
      auth: { token },
      transports: ['websocket'],
    });

    const payload = await new Promise<{
      namespace: string;
      role: string;
      socketId: string;
      userId: string;
    }>((resolve, reject) => {
      client?.once(SOCKET_EVENTS.CONNECTION_AUTHENTICATED, resolve);
      client?.once('connect_error', reject);
    });

    assert.equal(payload.userId, userId);
    assert.equal(payload.role, 'customer');
    assert.equal(payload.namespace, '/');
    assert.ok(payload.socketId);
  } finally {
    client?.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});

test('root socket rejects unauthenticated connections', async () => {
  const httpServer = createServer();
  const port = await listen(httpServer);
  initializeSocketServer(httpServer);
  let client: SocketClient | undefined;

  try {
    client = createClient(`http://127.0.0.1:${port}`, {
      transports: ['websocket'],
      reconnection: false,
    });

    const error = await new Promise<Error & { data?: { code?: string } }>((resolve) => {
      client?.once('connect_error', resolve);
    });

    assert.match(error.message, /Authentication token is required/);
    assert.equal(error.data?.code, SOCKET_ERROR_CODES.AUTH_REQUIRED);
  } finally {
    client?.disconnect();
    await closeSocketServer();
    await closeHttpServer(httpServer);
  }
});
