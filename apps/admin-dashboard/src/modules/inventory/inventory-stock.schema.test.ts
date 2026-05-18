import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INVENTORY_STOCK_STATUS } from './constants/inventory.constants';
import { inventoryStockFormSchema } from './forms/inventory-stock.schema';

test('inventoryStockFormSchema requires store product', () => {
  const result = inventoryStockFormSchema.safeParse({
    availableQuantity: 1,
    status: INVENTORY_STOCK_STATUS.ACTIVE,
  });
  assert.equal(result.success, false);
});
