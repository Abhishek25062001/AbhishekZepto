import assert from 'node:assert/strict';
import { test } from 'node:test';

import { vendorOrderItemQuantitySchema } from './vendor-order-item-quantity.schema';

test('vendorOrderItemQuantitySchema accepts a positive integer quantity', () => {
  assert.equal(vendorOrderItemQuantitySchema.parse({ quantity: '3' }).quantity, 3);
});

test('vendorOrderItemQuantitySchema rejects zero quantity', () => {
  assert.equal(vendorOrderItemQuantitySchema.safeParse({ quantity: 0 }).success, false);
});

test('vendorOrderItemQuantitySchema rejects negative quantity', () => {
  assert.equal(vendorOrderItemQuantitySchema.safeParse({ quantity: -1 }).success, false);
});

test('vendorOrderItemQuantitySchema rejects decimal quantity', () => {
  assert.equal(vendorOrderItemQuantitySchema.safeParse({ quantity: 1.5 }).success, false);
});
