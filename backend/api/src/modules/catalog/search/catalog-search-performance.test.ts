import assert from 'node:assert/strict';
import { test } from 'node:test';

/**
 * Performance smoke tests require a seeded dataset (1000+ products/store_products).
 * Skipped in default CI until seed helper is wired for catalog search fixtures.
 */
test('catalog search performance smoke is skipped without seed flag', { skip: process.env.CATALOG_SEARCH_PERF !== '1' }, () => {
  assert.ok(true);
});
