import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canReadInventory, canUpdateInventory } from './vendor-inventory-permissions.util';

test('adjust hidden without inventory:update', () => {
  assert.equal(canUpdateInventory(['inventory:read']), false);
  assert.equal(canUpdateInventory(['inventory:update']), true);
});

test('inventory read permission', () => {
  assert.equal(canReadInventory(['inventory:read']), true);
});
