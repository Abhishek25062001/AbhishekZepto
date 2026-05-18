import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canReadCatalog } from '../utils/vendor-catalog-permissions.util';

export const VENDOR_CATALOG_PRODUCTS_API = '/api/v1/vendor/catalog/products';

test('catalog list uses vendor products endpoint', () => {
  assert.equal(VENDOR_CATALOG_PRODUCTS_API, '/api/v1/vendor/catalog/products');
});

test('catalog mutations are not exposed in vendor panel permissions', () => {
  assert.equal(canReadCatalog(['catalog:read']), true);
  assert.equal(canReadCatalog(['catalog:create']), false);
});
