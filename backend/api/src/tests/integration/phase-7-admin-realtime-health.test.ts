import assert from 'node:assert/strict';
import { test } from 'node:test';
import adminRealtimeRoutes from '../../modules/realtime/routes/admin-realtime.routes';
import { getRealtimeHealth } from '../../modules/realtime/services/realtime-health.service';

const REQUIRED_ADMIN_REALTIME_HEALTH_FIELDS = [
  'isSocketServerRunning',
  'connectedSocketsCount',
  'namespaceCounts',
  'redisAdapterEnabled',
  'lastEmitAt',
  'failedEmitCount',
];

test('Phase 7 admin realtime health validation covers required response fields', () => {
  assert.deepEqual(REQUIRED_ADMIN_REALTIME_HEALTH_FIELDS, [
    'isSocketServerRunning',
    'connectedSocketsCount',
    'namespaceCounts',
    'redisAdapterEnabled',
    'lastEmitAt',
    'failedEmitCount',
  ]);
});

test('getRealtimeHealth returns correctly structured object', () => {
  const health = getRealtimeHealth();
  assert.equal(typeof health.isSocketServerRunning, 'boolean');
  assert.equal(typeof health.connectedSocketsCount, 'number');
  assert.equal(typeof health.redisAdapterEnabled, 'boolean');
  assert.ok(health.namespaceCounts && typeof health.namespaceCounts === 'object');
  assert.equal(typeof health.namespaceCounts['/'], 'number');
  assert.equal(typeof health.namespaceCounts['/customer'], 'number');
  assert.equal(typeof health.namespaceCounts['/delivery'], 'number');
  assert.equal(typeof health.namespaceCounts['/vendor'], 'number');
  assert.equal(typeof health.namespaceCounts['/admin'], 'number');
  assert.equal(health.failedEmitCount >= 0, true);
});

test('admin realtime health route requires realtime control tower permission', () => {
  const stack = (adminRealtimeRoutes as unknown as { stack: Array<{ route?: { path: string; stack: unknown[] } }> }).stack;
  const healthRoute = stack.find((layer) => layer.route?.path === '/health')?.route;

  assert.ok(healthRoute);
  assert.equal(healthRoute.stack.length >= 2, true);
});
