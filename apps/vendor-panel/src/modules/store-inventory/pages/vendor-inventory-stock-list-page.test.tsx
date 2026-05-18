import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canUpdateInventory } from '../utils/vendor-inventory-permissions.util';

export const VENDOR_INVENTORY_STOCKS_API = '/api/v1/vendor/inventory/stocks';

test('stock list uses vendor stocks endpoint', () => {
  assert.equal(VENDOR_INVENTORY_STOCKS_API, '/api/v1/vendor/inventory/stocks');
});

test('adjust action hidden without inventory:update', () => {
  assert.equal(canUpdateInventory(['inventory:read']), false);
  assert.equal(canUpdateInventory(['inventory:update']), true);
});
