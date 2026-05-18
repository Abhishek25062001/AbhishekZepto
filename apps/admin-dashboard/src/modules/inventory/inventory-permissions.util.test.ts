import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  canAdjustInventory,
  canBulkUpdateInventory,
  canBulkUpdateStoreProducts,
  canReadStoreProducts,
} from './utils/inventory-permissions.util';

test('inventory permission helpers honor exact grants', () => {
  assert.equal(canReadStoreProducts(['store_products:read']), true);
  assert.equal(canBulkUpdateStoreProducts(['store_products:bulk_update']), true);
  assert.equal(canAdjustInventory(['inventory:adjust']), true);
  assert.equal(canBulkUpdateInventory(['inventory:bulk_update']), true);
});

test('expire-due maps to inventory:adjust', () => {
  assert.equal(canAdjustInventory(['inventory:read']), false);
  assert.equal(canAdjustInventory(['inventory:adjust']), true);
});
