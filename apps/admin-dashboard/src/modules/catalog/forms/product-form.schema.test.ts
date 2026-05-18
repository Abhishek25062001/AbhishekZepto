import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { PRODUCT_TYPE } from '../constants/product.constants';
import { productFormSchema } from './product-form.schema';

test('productFormSchema enforces taxonomy fields', () => {
  const result = productFormSchema.safeParse({
    categoryId: 'cat-1',
    isFeatured: false,
    isVisible: true,
    name: 'Sparkling water',
    productType: PRODUCT_TYPE.SIMPLE,
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, true);
});

test('productFormSchema rejects simple/bundle placeholder mismatch', () => {
  const result = productFormSchema.safeParse({
    categoryId: 'cat-1',
    isFeatured: false,
    isVisible: true,
    name: 'Invalid',
    productType: 'variant',
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, false);
});

test('productFormSchema allows optional food type to be blank', () => {
  const result = productFormSchema.safeParse({
    categoryId: 'cat-1',
    foodType: '',
    isFeatured: false,
    isVisible: true,
    name: 'Still water',
    productType: PRODUCT_TYPE.BUNDLE_PLACEHOLDER,
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.foodType, undefined);
  }
});
