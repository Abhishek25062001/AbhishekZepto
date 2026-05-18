import assert from 'node:assert/strict';
import { test } from 'node:test';

import { vendorStoreProductAvailabilitySchema } from './vendor-store-product-availability.schema';

test('availability form blocks empty change set', () => {
  assert.equal(vendorStoreProductAvailabilitySchema.safeParse({}).success, false);
});

test('availability form accepts patch payload', () => {
  assert.equal(vendorStoreProductAvailabilitySchema.safeParse({ isAvailable: false }).success, true);
});
