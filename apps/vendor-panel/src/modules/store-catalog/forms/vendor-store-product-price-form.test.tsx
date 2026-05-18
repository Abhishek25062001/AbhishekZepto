import assert from 'node:assert/strict';
import { test } from 'node:test';

import { vendorStoreProductPriceSchema } from './vendor-store-product-price.schema';

test('price form blocks submit payload when selling price exceeds mrp', () => {
  const result = vendorStoreProductPriceSchema.safeParse({ mrp: 50, sellingPrice: 60 });
  assert.equal(result.success, false);
});

test('price form allows valid patch payload', () => {
  const result = vendorStoreProductPriceSchema.safeParse({ sellingPrice: 45, mrp: 50 });
  assert.equal(result.success, true);
});
