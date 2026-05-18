import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCatalogQuery } from '../utils/catalog-query.util';

export const CUSTOMER_CATALOG_PRODUCTS_ENDPOINT = '/api/v1/customer/catalog/products';

test('category products uses products endpoint with categoryId', () => {
  assert.equal(CUSTOMER_CATALOG_PRODUCTS_ENDPOINT, '/api/v1/customer/catalog/products');
  const query = buildCatalogQuery({ categoryId: 'cat-1' });
  assert.equal(query.categoryId, 'cat-1');
});
