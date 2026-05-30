import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getRealtimeConnectionBannerMessage } from '../utils/realtime-connection-banner.util';

test('reconnect banner renders when disconnected during reconnect', () => {
  assert.equal(
    getRealtimeConnectionBannerMessage({
      connectionError: null,
      connectionState: 'reconnecting',
      socketConnected: false,
    }),
    'Connecting...',
  );
});

test('reconnect banner hides after reconnect', () => {
  assert.equal(
    getRealtimeConnectionBannerMessage({
      connectionError: null,
      connectionState: 'connected',
      socketConnected: true,
    }),
    null,
  );
});
