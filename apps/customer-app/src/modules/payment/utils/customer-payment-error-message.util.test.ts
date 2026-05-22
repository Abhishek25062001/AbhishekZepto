import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getPaymentErrorCode,
  getPaymentErrorMessage,
  isCheckoutSessionExpiredOnPaymentError,
  isPaymentCancelledError,
  isPaymentGatewayError,
  isPaymentVerificationFailedError,
  PaymentCancelledError,
} from './customer-payment-error-message.util';

test('isPaymentVerificationFailedError detects PAYMENT_VERIFICATION_FAILED', () => {
  const error = {
    response: { data: { error: { code: 'PAYMENT_VERIFICATION_FAILED' } } },
  };
  assert.equal(isPaymentVerificationFailedError(error), true);
});

test('isPaymentGatewayError detects PAYMENT_GATEWAY_ERROR', () => {
  const error = {
    response: { data: { error: { code: 'PAYMENT_GATEWAY_ERROR' } } },
  };
  assert.equal(isPaymentGatewayError(error), true);
});

test('isCheckoutSessionExpiredOnPaymentError detects CHECKOUT_SESSION_EXPIRED', () => {
  const error = {
    response: { data: { error: { code: 'CHECKOUT_SESSION_EXPIRED' } } },
  };
  assert.equal(isCheckoutSessionExpiredOnPaymentError(error), true);
});

test('getPaymentErrorMessage maps verification failed', () => {
  const error = {
    response: { data: { error: { code: 'PAYMENT_VERIFICATION_FAILED' } } },
  };
  assert.match(getPaymentErrorMessage(error, 'fallback'), /verification/i);
});

test('isPaymentCancelledError detects PaymentCancelledError', () => {
  assert.equal(isPaymentCancelledError(new PaymentCancelledError()), true);
});

test('getPaymentErrorCode returns code when present', () => {
  const error = {
    response: { data: { error: { code: 'PAYMENT_NOT_FOUND' } } },
  };
  assert.equal(getPaymentErrorCode(error), 'PAYMENT_NOT_FOUND');
});
