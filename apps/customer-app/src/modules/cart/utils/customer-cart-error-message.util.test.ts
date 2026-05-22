import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getCustomerCartErrorCode,
  getCustomerCartErrorMessage,
  isCartNotFoundError,
  isCartPriceChangedError,
} from './customer-cart-error-message.util';

test('isCartNotFoundError detects CART_NOT_FOUND', () => {
  const error = {
    response: { data: { error: { code: 'CART_NOT_FOUND' } } },
  };
  assert.equal(isCartNotFoundError(error), true);
});

test('getCustomerCartErrorMessage maps insufficient stock', () => {
  const error = {
    response: { data: { error: { code: 'CART_INSUFFICIENT_STOCK' } } },
  };
  assert.match(getCustomerCartErrorMessage(error, 'fallback'), /stock/i);
});

test('isCartPriceChangedError detects CART_PRICE_CHANGED', () => {
  const error = {
    response: { data: { error: { code: 'CART_PRICE_CHANGED' } } },
  };
  assert.equal(isCartPriceChangedError(error), true);
});

test('getCustomerCartErrorMessage maps price changed to refresh hint', () => {
  const error = {
    response: { data: { error: { code: 'CART_PRICE_CHANGED' } } },
  };
  assert.match(getCustomerCartErrorMessage(error, 'fallback'), /refresh/i);
});

test('getCustomerCartErrorCode returns code when present', () => {
  const error = {
    response: { data: { error: { code: 'CART_MAX_QUANTITY_EXCEEDED' } } },
  };
  assert.equal(getCustomerCartErrorCode(error), 'CART_MAX_QUANTITY_EXCEEDED');
});
