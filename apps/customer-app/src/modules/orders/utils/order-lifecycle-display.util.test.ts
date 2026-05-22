import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getCustomerTimelineEventLabel,
  getCustomerTimelineEventReason,
} from './order-lifecycle-display.util';

test('getCustomerTimelineEventLabel maps timeline status to customer-safe labels', () => {
  assert.equal(getCustomerTimelineEventLabel({ toStatus: 'accepted' }), 'Store accepted');
  assert.equal(getCustomerTimelineEventLabel({ toStatus: 'ready_for_pickup' }), 'Ready for pickup');
  assert.equal(getCustomerTimelineEventLabel({ toStatus: 'cancelled' }), 'Cancelled');
});

test('getCustomerTimelineEventLabel falls back without status', () => {
  assert.equal(getCustomerTimelineEventLabel({ toStatus: null }), 'Order update');
});

test('getCustomerTimelineEventReason trims optional reason', () => {
  assert.equal(getCustomerTimelineEventReason({ reason: ' Changed plans ' }), 'Changed plans');
  assert.equal(getCustomerTimelineEventReason({ reason: '   ' }), null);
  assert.equal(getCustomerTimelineEventReason({ reason: null }), null);
});
