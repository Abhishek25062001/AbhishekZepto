import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../services/socket-server.service';

test.afterEach(async () => {
  await closeSocketServer();
});

test('socket server service initializes and returns singleton instance', () => {
  const httpServer = createServer();

  const firstServer = initializeSocketServer(httpServer);
  const secondServer = initializeSocketServer(httpServer);

  assert.equal(secondServer, firstServer);
  assert.equal(getSocketServer(), firstServer);
});

test('getSocketServer fails before initialization', async () => {
  await closeSocketServer();

  assert.throws(() => getSocketServer(), /Socket server has not been initialized/);
});
