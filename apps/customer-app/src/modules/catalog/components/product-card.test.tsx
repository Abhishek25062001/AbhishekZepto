import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getProductCardBadgeState,
  getProductCardNavigationParams,
} from './product-card-display.util';

test('product card shows discount badge when finalPrice < mrp', () => {
  const state = getProductCardBadgeState({
    id: 'p1',
    mrp: 100,
    finalPrice: 80,
    isOutOfStock: false,
  } as never);
  assert.equal(state.showDiscount, true);
  assert.equal(state.showOutOfStock, false);
});

test('product card shows out of stock badge', () => {
  const state = getProductCardBadgeState({
    id: 'p1',
    mrp: 100,
    finalPrice: 100,
    isOutOfStock: true,
  } as never);
  assert.equal(state.showOutOfStock, true);
  assert.equal(state.isDimmed, true);
});

test('product card shows unavailable badge', () => {
  const state = getProductCardBadgeState({
    id: 'p1',
    isAvailable: false,
    isOutOfStock: false,
  } as never);
  assert.equal(state.showUnavailable, true);
  assert.equal(state.isDimmed, true);
});

test('product card navigation uses productId', () => {
  assert.deepEqual(getProductCardNavigationParams('prod-1'), { productId: 'prod-1' });
});
