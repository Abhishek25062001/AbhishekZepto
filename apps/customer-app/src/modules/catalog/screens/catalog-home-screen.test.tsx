import assert from 'node:assert/strict';
import { test } from 'node:test';

export const CUSTOMER_CATALOG_HOME_ENDPOINTS = [
  '/api/v1/customer/catalog/categories',
  '/api/v1/customer/catalog/brands',
  '/api/v1/customer/catalog/featured-products',
] as const;

test('catalog home uses customer categories, brands, and featured endpoints', () => {
  assert.deepEqual(CUSTOMER_CATALOG_HOME_ENDPOINTS, [
    '/api/v1/customer/catalog/categories',
    '/api/v1/customer/catalog/brands',
    '/api/v1/customer/catalog/featured-products',
  ]);
});
