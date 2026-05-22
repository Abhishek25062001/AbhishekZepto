import type { Types } from 'mongoose';
import type { PaymentGateway } from '../constants/payment-gateway.constant';
import type { PaymentStatus } from '../constants/payment-status.constant';

export type PaymentRecord = {
  customerId: Types.ObjectId;
  checkoutSessionId: Types.ObjectId;
  orderId: Types.ObjectId | null;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  idempotencyKey: string;
  signatureVerified: boolean;
  webhookReceivedAt: Date | null;
  failureCode: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePaymentOrderInput = {
  checkoutSessionId: string;
  idempotencyKey: string;
};

export type CreatePaymentOrderResponse = {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyPaymentInput = {
  paymentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifyPaymentResponse = {
  paymentId: string;
  status: 'paid';
  orderId: string | null;
};

export type PaymentAuditContext = {
  actorId: string;
  requestId: string | null;
  traceId: string | null;
};
