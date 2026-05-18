import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCatalogQuery } from './catalog-query.util';

test('buildCatalogQuery omits empty filters', () => {
  assert.deepEqual(buildCatalogQuery({}), {});
  assert.deepEqual(buildCatalogQuery({ search: '  ', availability: 'all' }), {});
});

test('buildCatalogQuery includes set filters', () => {
  assert.deepEqual(
    buildCatalogQuery({
      categoryId: 'cat-1',
      brandId: 'brand-1',
      sortBy: 'newest',
      cityId: 'city-1',
      availability: 'available',
      minPrice: 10,
      maxPrice: 100,
    }),
    {
      categoryId: 'cat-1',
      brandId: 'brand-1',
      sortBy: 'newest',
      cityId: 'city-1',
      isAvailable: true,
      minPrice: 10,
      maxPrice: 100,
    },
  );
});
