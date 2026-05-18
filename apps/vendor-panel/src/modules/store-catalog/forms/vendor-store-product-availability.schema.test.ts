import assert from 'node:assert/strict';
import { test } from 'node:test';

import { STORE_PRODUCT_STATUS } from '../constants/vendor-store-product.constants';
import { vendorStoreProductAvailabilitySchema } from './vendor-store-product-availability.schema';

test('availability schema requires at least one field', () => {
  const result = vendorStoreProductAvailabilitySchema.safeParse({});
  assert.equal(result.success, false);
});

test('availability schema accepts status change', () => {
  const result = vendorStoreProductAvailabilitySchema.safeParse({
    status: STORE_PRODUCT_STATUS.INACTIVE,
  });
  assert.equal(result.success, true);
});
