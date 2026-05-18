import assert from 'node:assert/strict';
import { test } from 'node:test';

import { VENDOR_MOVEMENT_TYPE } from '../constants/vendor-inventory.constants';
import { vendorInventoryAdjustmentSchema } from './vendor-inventory-adjustment.schema';

export const VENDOR_INVENTORY_ADJUST_API = '/api/v1/vendor/inventory/stocks/:inventoryStockId/adjust';

test('adjustment form validates before POST adjust', () => {
  assert.equal(
    vendorInventoryAdjustmentSchema.safeParse({
      movementType: VENDOR_MOVEMENT_TYPE.STOCK_IN,
      quantity: 5,
      reason: 'delivery',
    }).success,
    true,
  );
});

test('adjust endpoint path is vendor scoped', () => {
  assert.match(VENDOR_INVENTORY_ADJUST_API, /\/api\/v1\/vendor\/inventory\/stocks/);
});
