import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildPaymentReceivedIdempotencyKeyForTests } from '../services/ledger-posting.service';

test('payment_received idempotency key follows payment:{paymentId}:payment_received', () => {
  assert.equal(
    buildPaymentReceivedIdempotencyKeyForTests('64f1c2a3b4d5e6f7a8b9c0d1'),
    'payment:64f1c2a3b4d5e6f7a8b9c0d1:payment_received',
  );
});
