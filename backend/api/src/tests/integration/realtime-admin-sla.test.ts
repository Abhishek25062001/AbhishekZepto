import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { io as createClient } from 'socket.io-client';
import { REALTIME_EVENTS } from '../../modules/realtime/constants/realtime-events.constant';
import {
  closeSocketServer,
  getSocketServer,
  initializeSocketServer,
} from '../../modules/realtime/services/socket-server.service';
import { buildCityRoom } from '../../modules/realtime/utils/realtime-room.util';
import { createRealtimeTestToken } from './realtime-test-auth.helper';

test('admin socket authenticates and receives city-scoped SLA breach event', async () => {
  const httpServer = createServer();
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  initializeSocketServer(httpServer);

  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');

  const cityId = new Types.ObjectId().toString();
  const { token } = createRealtimeTestToken({ role: 'operations_admin', cityId });
  const client = createClient(`http://127.0.0.1:${address.port}/admin`, {
    auth: { token },
    transports: ['websocket'],
  });

  await new Promise<void>((resolve, reject) => {
    client.once(REALTIME_EVENTS.CONNECTION_AUTHENTICATED, () => resolve());
    client.once('connect_error', reject);
  });

  const received = new Promise<{ data: { cityId: string } }>((resolve) => {
    client.once(REALTIME_EVENTS.ADMIN_DELIVERY_SLA_BREACH_CREATED, resolve);
  });

  getSocketServer()
    .of('/admin')
    .to(buildCityRoom(cityId))
    .emit(REALTIME_EVENTS.ADMIN_DELIVERY_SLA_BREACH_CREATED, {
      data: { cityId },
    });

  const payload = await received;
  assert.equal(payload.data.cityId, cityId);

  client.disconnect();
  await closeSocketServer();
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
});
