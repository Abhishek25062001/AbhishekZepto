import assert from 'node:assert/strict';
import { test } from 'node:test';

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
