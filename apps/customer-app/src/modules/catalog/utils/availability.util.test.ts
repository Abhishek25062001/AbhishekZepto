import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getAvailabilityState,
  getLowStockLabel,
  isLowStock,
} from './availability.util';

test('getAvailabilityState priority', () => {
  assert.equal(getAvailabilityState(false, true), 'unavailable');
  assert.equal(getAvailabilityState(true, true), 'out_of_stock');
  assert.equal(getAvailabilityState(true, false), 'available');
});

test('isLowStock threshold', () => {
  assert.equal(isLowStock(null), false);
  assert.equal(isLowStock(0), false);
  assert.equal(isLowStock(3), true);
  assert.equal(isLowStock(5), true);
  assert.equal(isLowStock(10), false);
});

test('getLowStockLabel', () => {
  assert.equal(getLowStockLabel(3), 'Only 3 left');
});
