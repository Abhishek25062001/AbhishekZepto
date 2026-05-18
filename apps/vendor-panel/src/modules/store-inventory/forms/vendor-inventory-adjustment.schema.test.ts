import assert from 'node:assert/strict';
import { test } from 'node:test';

import { VENDOR_MOVEMENT_TYPE } from '../constants/vendor-inventory.constants';
import { vendorInventoryAdjustmentSchema } from './vendor-inventory-adjustment.schema';

test('adjustment requires movement type', () => {
  const result = vendorInventoryAdjustmentSchema.safeParse({ quantity: 1, reason: 'test' });
  assert.equal(result.success, false);
});

test('adjustment rejects non-positive quantity', () => {
  const result = vendorInventoryAdjustmentSchema.safeParse({
    movementType: VENDOR_MOVEMENT_TYPE.STOCK_IN,
    quantity: 0,
    reason: 'test',
  });
  assert.equal(result.success, false);
});

test('adjustment requires reason', () => {
  const result = vendorInventoryAdjustmentSchema.safeParse({
    movementType: VENDOR_MOVEMENT_TYPE.STOCK_OUT,
    quantity: 2,
    reason: '',
  });
  assert.equal(result.success, false);
});

test('adjustment accepts vendor movement types', () => {
  const result = vendorInventoryAdjustmentSchema.safeParse({
    movementType: VENDOR_MOVEMENT_TYPE.CORRECTION,
    quantity: 3,
    reason: 'count fix',
  });
  assert.equal(result.success, true);
});
