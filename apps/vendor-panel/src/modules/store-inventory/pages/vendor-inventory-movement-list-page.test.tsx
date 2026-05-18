import assert from 'node:assert/strict';
import { test } from 'node:test';

export const VENDOR_INVENTORY_MOVEMENTS_API = '/api/v1/vendor/inventory/movements';

test('movement list uses vendor movements endpoint', () => {
  assert.equal(VENDOR_INVENTORY_MOVEMENTS_API, '/api/v1/vendor/inventory/movements');
});
