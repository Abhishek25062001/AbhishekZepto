import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { io as createClient } from 'socket.io-client';
import { REALTIME_EVENTS } from '../../modules/realtime/constants/realtime-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildDeliveryRoom } from '../../modules/realtime/utils/realtime-room.util';
import { createRealtimeTestToken } from './realtime-test-auth.helper';

test('delivery socket authenticates and receives assignment event', async () => {
  const httpServer = createServer();
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  initializeSocketServer(httpServer);

  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');

  const { token, userId } = createRealtimeTestToken({ role: 'delivery_agent' });
  const client = createClient(`http://127.0.0.1:${address.port}/delivery`, {
    auth: { token },
    transports: ['websocket'],
  });

  await new Promise<void>((resolve, reject) => {
    client.once(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, () => resolve());
    client.once('connect_error', reject);
  });

  const received = new Promise<{ data: { deliveryAgentId: string } }>((resolve) => {
    client.once(REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED, resolve);
  });

  getSocketServer()
    .of('/delivery')
    .to(buildDeliveryRoom(userId))
    .emit(REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED, {
      data: { deliveryAgentId: userId },
    });

  const payload = await received;
  assert.equal(payload.data.deliveryAgentId, userId);

  client.disconnect();
  await closeSocketServer();
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
});
