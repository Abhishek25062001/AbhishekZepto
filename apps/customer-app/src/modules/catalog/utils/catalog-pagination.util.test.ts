import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { ApiPaginationMeta } from '../../../types/api.types';
import type { CustomerProduct } from '../types/customer-product.types';

import {
  getCatalogHasNextPage,
  getInitialCatalogPage,
  mergeCatalogPages,
} from './catalog-pagination.util';

const product = (id: string): CustomerProduct =>
  ({
    id,
    name: `Product ${id}`,
  }) as CustomerProduct;

test('mergeCatalogPages dedupes by id', () => {
  const merged = mergeCatalogPages([
    [product('a'), product('b')],
    [product('b'), product('c')],
  ]);
  assert.deepEqual(merged.map((item) => item.id), ['a', 'b', 'c']);
});

test('getCatalogHasNextPage uses meta flag', () => {
  const pagination: ApiPaginationMeta = {
    page: 1,
    limit: 20,
    total: 50,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: false,
  };
  assert.equal(getCatalogHasNextPage(pagination), true);
  assert.equal(getCatalogHasNextPage({ ...pagination, hasNextPage: false }), false);
});

test('getCatalogHasNextPage falls back to loaded count', () => {
  const pagination: ApiPaginationMeta = {
    page: 1,
    limit: 20,
    total: 25,
    totalPages: 2,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  assert.equal(getCatalogHasNextPage(pagination, 20), true);
  assert.equal(getCatalogHasNextPage(pagination, 25), false);
});

test('getInitialCatalogPage returns 1', () => {
  assert.equal(getInitialCatalogPage(), 1);
});
