import { Types } from 'mongoose';
import { PAYMENT_GATEWAY } from '../constants/payment-gateway.constant';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import type { PaymentRecord } from '../types/payment.types';

export const buildTestPaymentRecord = (
  overrides: Partial<PaymentRecord & { _id: Types.ObjectId }> = {},
): PaymentRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(),
  customerId: new Types.ObjectId(),
  checkoutSessionId: new Types.ObjectId(),
  orderId: null,
  storeId: null,
  vendorId: null,
  cityId: null,
  gateway: PAYMENT_GATEWAY.RAZORPAY,
  gatewayOrderId: 'order_test',
  gatewayPaymentId: null,
  gatewayStatus: null,
  paymentMethod: null,
  amount: 25000,
  payableAmount: 25000,
  currency: 'INR',
  refundedAmount: 0,
  status: PAYMENT_STATUS.CREATED,
  idempotencyKey: 'idem-1',
  signatureVerified: false,
  webhookReceivedAt: null,
  webhookEventIds: [],
  failureCode: null,
  paidAt: null,
  failedAt: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
