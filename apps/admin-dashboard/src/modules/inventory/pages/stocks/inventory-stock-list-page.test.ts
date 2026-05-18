import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canAdjustInventory, canBulkUpdateInventory } from '../../utils/inventory-permissions.util';

test('adjust hidden without inventory:adjust', () => {
  assert.equal(canAdjustInventory(['inventory:read']), false);
});

test('bulk hidden without inventory:bulk_update', () => {
  assert.equal(canBulkUpdateInventory(['inventory:read']), false);
  assert.equal(canBulkUpdateInventory(['inventory:bulk_update']), true);
});
