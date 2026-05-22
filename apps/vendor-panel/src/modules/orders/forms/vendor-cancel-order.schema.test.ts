import assert from 'node:assert/strict';
import { test } from 'node:test';

import { vendorCancelOrderSchema } from './vendor-cancel-order.schema';

test('vendorCancelOrderSchema requires a reason', () => {
  assert.equal(vendorCancelOrderSchema.safeParse({ reason: '' }).success, false);
});

test('vendorCancelOrderSchema trims a valid reason', () => {
  assert.equal(vendorCancelOrderSchema.parse({ reason: '  Store stock mismatch  ' }).reason, 'Store stock mismatch');
});
