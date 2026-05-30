import assert from 'node:assert/strict';
import test from 'node:test';

import { getAdminRealtimeConnectionBannerMessage } from '../utils/admin-realtime-connection-banner.util';

test('connection banner hides when socket is connected', () => {
  assert.equal(getAdminRealtimeConnectionBannerMessage('connected', null), null);
});

test('connection banner shows reconnecting message for transient states', () => {
  assert.equal(
    getAdminRealtimeConnectionBannerMessage('reconnecting', null),
    'Reconnecting live control tower...',
  );
});

test('connection banner shows failure details', () => {
  assert.equal(
    getAdminRealtimeConnectionBannerMessage('failed', 'socket unavailable'),
    'socket unavailable',
  );
});

