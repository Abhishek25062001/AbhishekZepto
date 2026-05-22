import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { test } from 'node:test';
import {
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from './razorpay-signature.util';

test('verifyRazorpayPaymentSignature accepts valid HMAC', () => {
  const secret = 'test_secret';
  const orderId = 'order_abc';
  const paymentId = 'pay_xyz';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  assert.equal(
    verifyRazorpayPaymentSignature({ orderId, paymentId, signature, secret }),
    true,
  );
});

test('verifyRazorpayPaymentSignature rejects invalid HMAC', () => {
  assert.equal(
    verifyRazorpayPaymentSignature({
      orderId: 'order_abc',
      paymentId: 'pay_xyz',
      signature: 'invalid',
      secret: 'test_secret',
    }),
    false,
  );
});

test('verifyRazorpayWebhookSignature accepts valid body HMAC', () => {
  const webhookSecret = 'whsec_test';
  const rawBody = '{"event":"payment.captured"}';
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  assert.equal(
    verifyRazorpayWebhookSignature({ rawBody, signature, webhookSecret }),
    true,
  );
});
