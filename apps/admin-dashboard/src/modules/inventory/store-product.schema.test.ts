import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DISCOUNT_TYPE, STORE_PRODUCT_STATUS } from './constants/store-product.constants';
import { storeProductFormSchema } from './forms/store-product.schema';

test('storeProductFormSchema rejects sellingPrice above mrp', () => {
  const result = storeProductFormSchema.safeParse({
    discountType: DISCOUNT_TYPE.NONE,
    isAvailable: true,
    isFeatured: false,
    isVisible: true,
    mrp: 100,
    productId: 'p1',
    sellingPrice: 150,
    status: STORE_PRODUCT_STATUS.ACTIVE,
    storeId: 's1',
    variantId: 'v1',
  });
  assert.equal(result.success, false);
});

test('storeProductFormSchema accepts valid pricing', () => {
  const result = storeProductFormSchema.safeParse({
    discountType: DISCOUNT_TYPE.NONE,
    isAvailable: true,
    isFeatured: false,
    isVisible: true,
    mrp: 100,
    productId: 'p1',
    sellingPrice: 90,
    status: STORE_PRODUCT_STATUS.ACTIVE,
    storeId: 's1',
    variantId: 'v1',
  });
  assert.equal(result.success, true);
});
