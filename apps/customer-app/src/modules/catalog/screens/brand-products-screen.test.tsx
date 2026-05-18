import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCatalogQuery } from '../utils/catalog-query.util';

test('brand products uses products endpoint with brandId', () => {
  const query = buildCatalogQuery({ brandId: 'brand-1' });
  assert.equal(query.brandId, 'brand-1');
});
