import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MOVEMENT_TYPE } from './constants/inventory.constants';
import { inventoryAdjustmentFormSchema } from './forms/inventory-adjustment.schema';

test('inventoryAdjustmentFormSchema requires positive quantity and reason', () => {
  const result = inventoryAdjustmentFormSchema.safeParse({
    movementType: MOVEMENT_TYPE.STOCK_IN,
    quantity: 0,
    reason: '',
  });
  assert.equal(result.success, false);
});
