import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canAdjustInventory } from '../../utils/inventory-permissions.util';

test('expire-due hidden without inventory:adjust', () => {
  assert.equal(canAdjustInventory(['inventory:read']), false);
  assert.equal(canAdjustInventory(['inventory:adjust']), true);
});
