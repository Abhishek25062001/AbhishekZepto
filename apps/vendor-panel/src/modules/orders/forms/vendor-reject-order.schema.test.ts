import assert from 'node:assert/strict';
import { test } from 'node:test';

import { vendorRejectOrderSchema } from './vendor-reject-order.schema';

test('vendorRejectOrderSchema requires a reason', () => {
  assert.equal(vendorRejectOrderSchema.safeParse({ reason: '   ' }).success, false);
});

test('vendorRejectOrderSchema trims a valid reason', () => {
  const result = vendorRejectOrderSchema.parse({ reason: '  Out of stock  ' });
  assert.deepEqual(result, { reason: 'Out of stock' });
});
