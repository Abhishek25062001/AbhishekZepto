import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getVendorRealtimeConnectionBannerMessage } from '../utils/vendor-realtime-connection-banner.util';

test('vendor realtime connection banner shows reconnecting message', () => {
  assert.equal(
    getVendorRealtimeConnectionBannerMessage('reconnecting', null),
    'Reconnecting live store updates...',
  );
});

test('vendor realtime connection banner shows failure message', () => {
  assert.equal(
    getVendorRealtimeConnectionBannerMessage('failed', 'socket unavailable'),
    'socket unavailable',
  );
  assert.equal(
    getVendorRealtimeConnectionBannerMessage('failed', null),
    'Live store updates unavailable',
  );
});

test('vendor realtime connection banner hides when connected', () => {
  assert.equal(getVendorRealtimeConnectionBannerMessage('connected', null), null);
});

