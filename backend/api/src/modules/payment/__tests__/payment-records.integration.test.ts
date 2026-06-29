import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getCustomerPaymentById,
  listAdminPayments,
} from '../services/payment.service';
import {
  toAdminPaymentResponse,
  toCustomerPaymentResponse,
} from '../utils/payment-response.mapper';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { PAYMENT_GATEWAY } from '../constants/payment-gateway.constant';
import { Types } from 'mongoose';

test('payment response mappers exclude sensitive fields from customer view', () => {
  const payment = {
    _id: new Types.ObjectId(),
    customerId: new Types.ObjectId(),
    checkoutSessionId: new Types.ObjectId(),
    orderId: null,
    storeId: new Types.ObjectId(),
    vendorId: null,
    cityId: null,
    gateway: PAYMENT_GATEWAY.RAZORPAY,
    gatewayOrderId: 'order_test',
    gatewayPaymentId: 'pay_test',
    gatewayStatus: null,
    paymentMethod: null,
    amount: 10000,
    payableAmount: 10000,
    currency: 'INR',
    refundedAmount: 0,
    status: PAYMENT_STATUS.PAID,
    idempotencyKey: 'idem-1',
    signatureVerified: true,
    webhookReceivedAt: null,
    webhookEventIds: [],
    failureCode: null,
    paidAt: new Date(),
    failedAt: null,
    metadata: { gatewaySignature: 'secret' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const customer = toCustomerPaymentResponse(payment);
  assert.ok(!('metadata' in customer));
  assert.ok(!('idempotencyKey' in customer));
  assert.equal(customer.paymentId, payment._id.toString());

  const admin = toAdminPaymentResponse(payment);
  assert.equal(admin.customerId, payment.customerId.toString());
  assert.equal(admin.storeId, payment.storeId?.toString() ?? null);
});

test('listAdminPayments and getCustomerPaymentById are exported service functions', () => {
  assert.equal(typeof listAdminPayments, 'function');
  assert.equal(typeof getCustomerPaymentById, 'function');
});
