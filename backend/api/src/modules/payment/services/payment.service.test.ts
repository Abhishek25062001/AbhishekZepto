import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { CHECKOUT_SESSION_STATUS } from '../../checkout/constants/checkout-session-status.constant';
import type { CheckoutSessionRecord } from '../../checkout/types/checkout.types';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import type { PaymentRecord } from '../types/payment.types';
import * as checkoutRepositoryModule from '../../checkout/repositories/checkout-session.repository';
import * as gatewayModule from '../gateways/razorpay.gateway';
import * as envModule from '../../../config/env';
import * as paymentRepositoryModule from '../repositories/payment.repository';
import * as compensationModule from '../utils/payment-failure-compensation.util';
import * as auditModule from '../../audit/services/audit-log.service';
import * as orderServiceModule from '../../orders/services/order.service';
import {
  createPaymentOrderForCustomer,
  verifyPaymentForCustomer,
} from './payment.service';

const checkoutRepository = checkoutRepositoryModule as unknown as {
  findCheckoutSessionByIdForCustomer: typeof checkoutRepositoryModule.findCheckoutSessionByIdForCustomer;
  setCheckoutSessionPaymentId: typeof checkoutRepositoryModule.setCheckoutSessionPaymentId;
};

const paymentRepository = paymentRepositoryModule as unknown as {
  findPaymentByIdempotencyKey: typeof paymentRepositoryModule.findPaymentByIdempotencyKey;
  createPayment: typeof paymentRepositoryModule.createPayment;
  findPaymentByIdForCustomer: typeof paymentRepositoryModule.findPaymentByIdForCustomer;
  updatePaymentById: typeof paymentRepositoryModule.updatePaymentById;
};

const gateway = gatewayModule as unknown as {
  createRazorpayOrder: typeof gatewayModule.createRazorpayOrder;
  getRazorpayPublicKeyId: typeof gatewayModule.getRazorpayPublicKeyId;
};

const compensation = compensationModule as unknown as {
  compensateFailedPayment: typeof compensationModule.compensateFailedPayment;
};

const auditLogService = auditModule as unknown as {
  writeAuditLog: typeof auditModule.writeAuditLog;
};

const orderService = orderServiceModule as unknown as {
  placeOrderFromPayment: typeof orderServiceModule.placeOrderFromPayment;
};

const envConfig = envModule as unknown as {
  getRazorpayKeySecret: typeof envModule.getRazorpayKeySecret;
};

const customerId = new Types.ObjectId().toString();
const sessionId = new Types.ObjectId();
const paymentId = new Types.ObjectId();

const buildSession = (): CheckoutSessionRecord & { _id: Types.ObjectId } => ({
  _id: sessionId,
  customerId: new Types.ObjectId(customerId),
  cartId: new Types.ObjectId(),
  storeId: new Types.ObjectId(),
  addressId: new Types.ObjectId(),
  addressSnapshot: {
    label: 'Home',
    line1: 'Line 1',
    line2: null,
    landmark: null,
    city: 'City',
    state: null,
    postalCode: null,
    country: 'IN',
    latitude: 0,
    longitude: 0,
  },
  status: CHECKOUT_SESSION_STATUS.INITIATED,
  lockTokens: ['lk_1'],
  reservationExpiresAt: new Date(Date.now() + 60_000),
  summarySnapshot: {
    currency: 'INR',
    itemCount: 1,
    subtotal: 250,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 250,
    items: [],
  },
  paymentId: null,
  orderId: null,
  idempotencyKey: null,
  failureReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildPayment = (): PaymentRecord & { _id: Types.ObjectId } => ({
  _id: paymentId,
  customerId: new Types.ObjectId(customerId),
  checkoutSessionId: sessionId,
  orderId: null,
  gateway: 'razorpay',
  gatewayOrderId: 'order_test',
  gatewayPaymentId: null,
  amount: 25000,
  currency: 'INR',
  status: PAYMENT_STATUS.CREATED,
  idempotencyKey: 'idem-1',
  signatureVerified: false,
  webhookReceivedAt: null,
  failureCode: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
  gateway.getRazorpayPublicKeyId = () => 'rzp_test_key';
  envConfig.getRazorpayKeySecret = () => 'test_secret';
  orderService.placeOrderFromPayment = async () => ({
    orderId: new Types.ObjectId().toString(),
    orderNumber: 'ORD-TEST',
    orderStatus: 'placed',
    grandTotal: 250,
    currency: 'INR',
    placedAt: new Date().toISOString(),
  });
});

afterEach(() => {
  auditLogService.writeAuditLog = auditModule.writeAuditLog;
});

test('createPaymentOrderForCustomer creates payment and links checkout session', async () => {
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => buildSession();
  paymentRepository.findPaymentByIdempotencyKey = async () => null;
  gateway.createRazorpayOrder = async () => ({
    id: 'order_test',
    amount: 25000,
    currency: 'INR',
  });
  paymentRepository.createPayment = async () => buildPayment();
  checkoutRepository.setCheckoutSessionPaymentId = async () => buildSession();

  const result = await createPaymentOrderForCustomer(customerId, {
    checkoutSessionId: sessionId.toString(),
    idempotencyKey: 'idem-1',
  });

  assert.equal(result.paymentId, paymentId.toString());
  assert.equal(result.razorpayOrderId, 'order_test');
  assert.equal(result.amount, 25000);
  assert.equal(result.keyId, 'rzp_test_key');
});

test('createPaymentOrderForCustomer returns existing payment for idempotency key', async () => {
  paymentRepository.findPaymentByIdempotencyKey = async () => buildPayment();

  const result = await createPaymentOrderForCustomer(customerId, {
    checkoutSessionId: sessionId.toString(),
    idempotencyKey: 'idem-1',
  });

  assert.equal(result.paymentId, paymentId.toString());
});

test('verifyPaymentForCustomer marks payment paid with valid signature', async () => {
  const payment = buildPayment();
  const orderId = payment.gatewayOrderId;
  const razorpayPaymentId = 'pay_test';
  const signature = crypto
    .createHmac('sha256', 'test_secret')
    .update(`${orderId}|${razorpayPaymentId}`)
    .digest('hex');

  paymentRepository.findPaymentByIdForCustomer = async () => payment;
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => buildSession();
  paymentRepository.updatePaymentById = async () => ({
    ...payment,
    status: PAYMENT_STATUS.PAID,
    gatewayPaymentId: razorpayPaymentId,
    signatureVerified: true,
  });

  const result = await verifyPaymentForCustomer(customerId, {
    paymentId: paymentId.toString(),
    razorpayOrderId: orderId,
    razorpayPaymentId,
    razorpaySignature: signature,
  });

  assert.equal(result.status, 'paid');
  assert.ok(result.orderId);
});

test('verifyPaymentForCustomer compensates on invalid signature', async () => {
  const payment = buildPayment();
  let compensated = false;

  paymentRepository.findPaymentByIdForCustomer = async () => payment;
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => buildSession();
  compensation.compensateFailedPayment = async () => {
    compensated = true;
  };

  await assert.rejects(
    () =>
      verifyPaymentForCustomer(customerId, {
        paymentId: paymentId.toString(),
        razorpayOrderId: payment.gatewayOrderId,
        razorpayPaymentId: 'pay_test',
        razorpaySignature: 'bad_signature',
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.PAYMENT_VERIFICATION_FAILED);
      return true;
    },
  );

  assert.equal(compensated, true);
});

test('verifyPaymentForCustomer is idempotent when already paid', async () => {
  const paid = {
    ...buildPayment(),
    status: PAYMENT_STATUS.PAID,
    signatureVerified: true,
    gatewayPaymentId: 'pay_test',
  };

  paymentRepository.findPaymentByIdForCustomer = async () => paid;

  const result = await verifyPaymentForCustomer(customerId, {
    paymentId: paymentId.toString(),
    razorpayOrderId: paid.gatewayOrderId,
    razorpayPaymentId: 'pay_test',
    razorpaySignature: 'ignored',
  });

  assert.equal(result.status, 'paid');
  assert.ok(result.orderId);
});
