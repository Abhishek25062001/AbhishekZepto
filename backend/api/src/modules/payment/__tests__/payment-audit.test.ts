import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PAYMENT_AUDIT_EVENTS } from '../constants/payment-audit-events.constant';

test('payment audit events include webhook and verification events', () => {
  assert.equal(PAYMENT_AUDIT_EVENTS.ORDER_CREATED, 'payment.order_created');
  assert.equal(PAYMENT_AUDIT_EVENTS.VERIFIED, 'payment.verified');
  assert.equal(PAYMENT_AUDIT_EVENTS.FAILED, 'payment.failed');
  assert.equal(PAYMENT_AUDIT_EVENTS.WEBHOOK_RECEIVED, 'payment.webhook_received');
});
