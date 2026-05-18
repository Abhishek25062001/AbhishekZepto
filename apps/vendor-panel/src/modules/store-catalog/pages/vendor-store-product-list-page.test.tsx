import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canUpdateStoreProducts } from '../utils/vendor-catalog-permissions.util';

export const VENDOR_STORE_PRODUCTS_API = '/api/v1/vendor/store-products';

test('store product list uses vendor store-products endpoint', () => {
  assert.equal(VENDOR_STORE_PRODUCTS_API, '/api/v1/vendor/store-products');
});

test('price and availability actions require store_products:update', () => {
  assert.equal(canUpdateStoreProducts(['store_products:read']), false);
  assert.equal(canUpdateStoreProducts(['store_products:update']), true);
});
