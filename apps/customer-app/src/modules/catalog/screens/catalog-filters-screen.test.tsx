import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useCatalogFilterStore } from '../store/catalog-filter.store';

test('filters store saves and clears category filter', () => {
  useCatalogFilterStore.getState().resetCatalogFilters();
  useCatalogFilterStore.getState().setCatalogFilter('categoryId', 'cat-99');
  assert.equal(useCatalogFilterStore.getState().categoryId, 'cat-99');
  useCatalogFilterStore.getState().resetCatalogFilters();
  assert.equal(useCatalogFilterStore.getState().categoryId, undefined);
});
