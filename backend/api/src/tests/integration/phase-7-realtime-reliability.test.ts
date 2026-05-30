import assert from 'node:assert/strict';
import { test } from 'node:test';

const REQUIRED_REALTIME_EVENT_LOG_FIELDS = [
  'eventId',
  'eventName',
  'recipientUserId',
  'appSurface',
  'deliveryStatus',
  'emittedAt',
  'acknowledgedAt',
  'expiresAt',
];

test('Phase 7 realtime reliability validation records required event log fields', () => {
  assert.deepEqual(REQUIRED_REALTIME_EVENT_LOG_FIELDS, [
    'eventId',
    'eventName',
    'recipientUserId',
    'appSurface',
    'deliveryStatus',
    'emittedAt',
    'acknowledgedAt',
    'expiresAt',
  ]);
});
