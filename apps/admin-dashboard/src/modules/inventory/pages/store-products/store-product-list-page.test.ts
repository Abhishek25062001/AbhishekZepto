import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canBulkUpdateStoreProducts, canCreateStoreProduct } from '../../utils/inventory-permissions.util';

test('bulk actions hidden without store_products:bulk_update', () => {
  assert.equal(canBulkUpdateStoreProducts(['store_products:read']), false);
  assert.equal(canCreateStoreProduct(['store_products:create']), true);
});
