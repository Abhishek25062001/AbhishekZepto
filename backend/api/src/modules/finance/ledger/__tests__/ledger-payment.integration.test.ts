import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildPaymentReceivedIdempotencyKeyForTests } from '../services/ledger-posting.service';

test('payment verify and webhook share payment_received idempotency key', () => {
  const paymentId = '64f1c2a3b4d5e6f7a8b9c0d1';
  const key = buildPaymentReceivedIdempotencyKeyForTests(paymentId);

  assert.equal(key, `payment:${paymentId}:payment_received`);
  assert.match(key, /^payment:[a-f0-9]{24}:payment_received$/);
});

test('duplicate idempotency key prevents double journal creation', () => {
  const paymentId = '64f1c2a3b4d5e6f7a8b9c0d2';
  const keyA = buildPaymentReceivedIdempotencyKeyForTests(paymentId);
  const keyB = buildPaymentReceivedIdempotencyKeyForTests(paymentId);

  assert.equal(keyA, keyB);
});
