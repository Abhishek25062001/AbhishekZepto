import assert from 'node:assert/strict';
import { test } from 'node:test';

import { computeCheckoutReservationTimer } from './checkout-reservation-timer.util';

test('computeCheckoutReservationTimer returns countdown for future expiry', () => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const state = computeCheckoutReservationTimer(expiresAt, Date.now());

  assert.equal(state.isExpired, false);
  assert.ok(state.remainingSeconds > 0);
  assert.match(state.formatted, /^\d{2}:\d{2}$/);
});

test('computeCheckoutReservationTimer marks past expiry as expired', () => {
  const expiresAt = new Date(Date.now() - 1000).toISOString();
  const state = computeCheckoutReservationTimer(expiresAt, Date.now());

  assert.equal(state.isExpired, true);
  assert.equal(state.remainingSeconds, 0);
  assert.equal(state.formatted, '00:00');
});
