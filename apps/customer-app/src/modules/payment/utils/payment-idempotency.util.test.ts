import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  createPaymentIdempotencyKey,
  isValidPaymentIdempotencyKey,
} from './payment-idempotency.util';

test('createPaymentIdempotencyKey returns non-empty unique keys', () => {
  const a = createPaymentIdempotencyKey();
  const b = createPaymentIdempotencyKey();

  assert.ok(a.length > 0);
  assert.ok(b.length > 0);
  assert.notEqual(a, b);
});

test('isValidPaymentIdempotencyKey enforces max length 128', () => {
  assert.equal(isValidPaymentIdempotencyKey('short-key'), true);
  assert.equal(isValidPaymentIdempotencyKey(''), false);
  assert.equal(isValidPaymentIdempotencyKey('x'.repeat(129)), false);
});
