import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getCheckoutErrorCode,
  getCheckoutErrorMessage,
  isCheckoutPriceChangedError,
  isCheckoutSessionExpiredError,
  isCheckoutStockUnavailableError,
} from './customer-checkout-error-message.util';

test('isCheckoutPriceChangedError detects CHECKOUT_PRICE_CHANGED', () => {
  const error = {
    response: { data: { error: { code: 'CHECKOUT_PRICE_CHANGED' } } },
  };
  assert.equal(isCheckoutPriceChangedError(error), true);
});

test('getCheckoutErrorMessage maps price changed to cart refresh hint', () => {
  const error = {
    response: { data: { error: { code: 'CHECKOUT_PRICE_CHANGED' } } },
  };
  assert.match(getCheckoutErrorMessage(error, 'fallback'), /cart/i);
});

test('isCheckoutSessionExpiredError detects CHECKOUT_SESSION_EXPIRED', () => {
  const error = {
    response: { data: { error: { code: 'CHECKOUT_SESSION_EXPIRED' } } },
  };
  assert.equal(isCheckoutSessionExpiredError(error), true);
});

test('isCheckoutStockUnavailableError detects CHECKOUT_STOCK_UNAVAILABLE', () => {
  const error = {
    response: { data: { error: { code: 'CHECKOUT_STOCK_UNAVAILABLE' } } },
  };
  assert.equal(isCheckoutStockUnavailableError(error), true);
});

test('getCheckoutErrorCode returns code when present', () => {
  const error = {
    response: { data: { error: { code: 'CHECKOUT_CART_EMPTY' } } },
  };
  assert.equal(getCheckoutErrorCode(error), 'CHECKOUT_CART_EMPTY');
});
