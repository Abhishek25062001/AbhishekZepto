import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  calculateDiscountPercentage,
  formatProductPrice,
  shouldShowDiscount,
} from './catalog-price.util';

test('calculateDiscountPercentage returns 0 when mrp <= finalPrice', () => {
  assert.equal(calculateDiscountPercentage(100, 100), 0);
  assert.equal(calculateDiscountPercentage(80, 100), 0);
});

test('calculateDiscountPercentage computes discount', () => {
  assert.equal(calculateDiscountPercentage(100, 80), 20);
});

test('formatProductPrice formats currency', () => {
  assert.equal(formatProductPrice(99.5), '₹99.50');
});

test('shouldShowDiscount is true when finalPrice < mrp', () => {
  assert.equal(shouldShowDiscount(100, 80), true);
  assert.equal(shouldShowDiscount(100, 100), false);
});
