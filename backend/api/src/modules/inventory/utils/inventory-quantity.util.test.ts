import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateStockFlags, calculateTotalQuantity } from './inventory-quantity.util';

test('calculateTotalQuantity sums all buckets', () => {
  assert.equal(calculateTotalQuantity(10, 2, 1, 1), 14);
});

test('calculateTotalQuantity blocks negative inputs', () => {
  assert.throws(() => calculateTotalQuantity(-1, 0, 0, 0));
});

test('calculateStockFlags marks out of stock when available is zero', () => {
  const flags = calculateStockFlags(0, 5);
  assert.equal(flags.isOutOfStock, true);
  assert.equal(flags.isLowStock, false);
});

test('calculateStockFlags marks low stock when above zero and at threshold', () => {
  const flags = calculateStockFlags(3, 5);
  assert.equal(flags.isOutOfStock, false);
  assert.equal(flags.isLowStock, true);
});
