import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { beforeEach, test } from 'node:test';
import { CHECKOUT_SESSION_STATUS } from '../../checkout/constants/checkout-session-status.constant';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import type { PaymentRecord } from '../types/payment.types';
import * as checkoutRepositoryModule from '../../checkout/repositories/checkout-session.repository';
import * as paymentRepositoryModule from '../repositories/payment.repository';
import * as compensationModule from '../utils/payment-failure-compensation.util';
import * as auditModule from '../../audit/services/audit-log.service';
import { handleRazorpayWebhookEvent } from './payment-webhook.service';

const checkoutRepository = checkoutRepositoryModule as unknown as {
  findCheckoutSessionByIdForCustomer: typeof checkoutRepositoryModule.findCheckoutSessionByIdForCustomer;
};

const paymentRepository = paymentRepositoryModule as unknown as {
  findPaymentByGatewayOrderId: typeof paymentRepositoryModule.findPaymentByGatewayOrderId;
  updatePaymentByGatewayOrderId: typeof paymentRepositoryModule.updatePaymentByGatewayOrderId;
};

const compensation = compensationModule as unknown as {
  compensateFailedPayment: typeof compensationModule.compensateFailedPayment;
};

const auditLogService = auditModule as unknown as {
  writeAuditLog: typeof auditModule.writeAuditLog;
};

const customerId = new Types.ObjectId();
const sessionId = new Types.ObjectId();
const paymentId = new Types.ObjectId();

const buildPayment = (status: PaymentRecord['status']): PaymentRecord & { _id: Types.ObjectId } => ({
  _id: paymentId,
  customerId,
  checkoutSessionId: sessionId,
  orderId: null,
  gateway: 'razorpay',
  gatewayOrderId: 'order_wh',
  gatewayPaymentId: null,
  amount: 10000,
  currency: 'INR',
  status,
  idempotencyKey: 'idem-wh',
  signatureVerified: status === PAYMENT_STATUS.PAID,
  webhookReceivedAt: null,
  failureCode: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

test('handleRazorpayWebhookEvent marks payment captured', async () => {
  let updated = false;

  paymentRepository.findPaymentByGatewayOrderId = async () =>
    buildPayment(PAYMENT_STATUS.CREATED);
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => ({
    _id: sessionId,
    customerId,
    cartId: new Types.ObjectId(),
    storeId: new Types.ObjectId(),
    addressId: new Types.ObjectId(),
    addressSnapshot: {} as never,
    status: CHECKOUT_SESSION_STATUS.INITIATED,
    lockTokens: [],
    reservationExpiresAt: new Date(Date.now() + 60_000),
    summarySnapshot: {} as never,
    paymentId: paymentId,
    orderId: null,
    idempotencyKey: null,
    failureReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  paymentRepository.updatePaymentByGatewayOrderId = async () => {
    updated = true;
    return buildPayment(PAYMENT_STATUS.PAID);
  };

  await handleRazorpayWebhookEvent({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_wh',
          order_id: 'order_wh',
        },
      },
    },
  });

  assert.equal(updated, true);
});

test('handleRazorpayWebhookEvent compensates on payment.failed', async () => {
  let compensated = false;

  paymentRepository.findPaymentByGatewayOrderId = async () =>
    buildPayment(PAYMENT_STATUS.CREATED);
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => ({
    _id: sessionId,
    customerId,
    cartId: new Types.ObjectId(),
    storeId: new Types.ObjectId(),
    addressId: new Types.ObjectId(),
    addressSnapshot: {} as never,
    status: CHECKOUT_SESSION_STATUS.INITIATED,
    lockTokens: ['lk_1'],
    reservationExpiresAt: new Date(Date.now() + 60_000),
    summarySnapshot: {} as never,
    paymentId: paymentId,
    orderId: null,
    idempotencyKey: null,
    failureReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  compensation.compensateFailedPayment = async () => {
    compensated = true;
  };
  paymentRepository.updatePaymentByGatewayOrderId = async () => buildPayment(PAYMENT_STATUS.FAILED);

  await handleRazorpayWebhookEvent({
    event: 'payment.failed',
    payload: {
      payment: {
        entity: {
          id: 'pay_wh',
          order_id: 'order_wh',
        },
      },
    },
  });

  assert.equal(compensated, true);
});
