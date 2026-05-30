import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getDeliveryRealtimeConnectionBannerMessage } from '../utils/delivery-realtime-connection-banner.util';

test('connection banner hides when socket is connected or idle', () => {
  assert.equal(
    getDeliveryRealtimeConnectionBannerMessage('connected', null),
    null,
  );
  assert.equal(getDeliveryRealtimeConnectionBannerMessage('idle', null), null);
});

test('connection banner shows reconnecting message for transient states', () => {
  assert.equal(
    getDeliveryRealtimeConnectionBannerMessage('reconnecting', null),
    'Reconnecting live updates...',
  );
  assert.equal(
    getDeliveryRealtimeConnectionBannerMessage('connecting', null),
    'Reconnecting live updates...',
  );
});

test('connection banner shows failure message when socket has failed', () => {
  assert.equal(
    getDeliveryRealtimeConnectionBannerMessage('failed', 'token expired'),
    'token expired',
  );
  assert.equal(
    getDeliveryRealtimeConnectionBannerMessage('failed', null),
    'Live updates unavailable',
  );
});

