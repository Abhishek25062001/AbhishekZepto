import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  canReadCatalog,
  canReadStoreProducts,
  canUpdateStoreProducts,
} from './vendor-catalog-permissions.util';

test('catalog read permission', () => {
  assert.equal(canReadCatalog(['catalog:read']), true);
  assert.equal(canReadCatalog(['orders:read']), false);
});

test('store product update hidden without permission', () => {
  assert.equal(canUpdateStoreProducts(['store_products:read']), false);
  assert.equal(canUpdateStoreProducts(['store_products:update']), true);
  assert.equal(canReadStoreProducts(['store_products:read']), true);
});
