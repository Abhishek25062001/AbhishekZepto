import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inventoryAdjustmentFormSchema } from './inventory-adjustment.schema';
import { MOVEMENT_TYPE } from '../constants/inventory.constants';

test('adjustment form requires reason', () => {
  const result = inventoryAdjustmentFormSchema.safeParse({
    movementType: MOVEMENT_TYPE.MANUAL_ADJUSTMENT,
    quantity: 5,
    reason: 'restock',
  });
  assert.equal(result.success, true);
});
