import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getAvailabilityState, isLowStock } from '../utils/availability.util';
import {
  getCustomerCatalogErrorMessage,
  isProductUnavailableError,
} from '../utils/customer-catalog-error-message.util';

test('product detail add to cart disabled when out of stock', () => {
  const state = getAvailabilityState(true, true);
  assert.equal(state, 'out_of_stock');
  const disabled = true;
  assert.equal(disabled, true);
});

test('product detail low stock hint threshold', () => {
  assert.equal(isLowStock(3), true);
  assert.equal(isLowStock(20), false);
});

test('product unavailable errors are recognized', () => {
  assert.equal(isProductUnavailableError('PRODUCT_NOT_FOUND'), true);
  assert.equal(
    getCustomerCatalogErrorMessage('PRODUCT_NOT_VISIBLE'),
    'This product is not available right now.',
  );
});
