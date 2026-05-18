import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DISCOUNT_TYPE } from '../constants/vendor-store-product.constants';
import { vendorStoreProductPriceSchema } from './vendor-store-product-price.schema';

test('price schema rejects selling price above mrp', () => {
  const result = vendorStoreProductPriceSchema.safeParse({ mrp: 100, sellingPrice: 150 });
  assert.equal(result.success, false);
});

test('price schema rejects percentage discount above 100', () => {
  const result = vendorStoreProductPriceSchema.safeParse({
    discountType: DISCOUNT_TYPE.PERCENTAGE,
    discountValue: 150,
  });
  assert.equal(result.success, false);
});

test('price schema accepts valid price update', () => {
  const result = vendorStoreProductPriceSchema.safeParse({
    mrp: 100,
    sellingPrice: 90,
    discountType: DISCOUNT_TYPE.FLAT,
    discountValue: 10,
  });
  assert.equal(result.success, true);
});
