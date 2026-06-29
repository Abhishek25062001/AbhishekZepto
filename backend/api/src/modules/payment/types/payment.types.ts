import type { Types } from 'mongoose';
import type { PaymentGateway } from '../constants/payment-gateway.constant';
import type { PaymentStatus } from '../constants/payment-status.constant';

export type PaymentRecord = {
  customerId: Types.ObjectId;
  checkoutSessionId: Types.ObjectId;
  orderId: Types.ObjectId | null;
  storeId: Types.ObjectId | null;
  vendorId: Types.ObjectId | null;
  cityId: Types.ObjectId | null;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  gatewayStatus: string | null;
  paymentMethod: string | null;
  amount: number;
  payableAmount: number | null;
  currency: string;
  refundedAmount: number;
  status: PaymentStatus;
  idempotencyKey: string;
  signatureVerified: boolean;
  webhookReceivedAt: Date | null;
  webhookEventIds: string[];
  failureCode: string | null;
  paidAt: Date | null;
  failedAt: Date | null;
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

export type VerifyPaymentByIdParams = {
  paymentId: string;
};

export type VerifyPaymentByIdBody = {
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

export type CustomerPaymentResponse = {
  paymentId: string;
  orderId: string | null;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminPaymentResponse = CustomerPaymentResponse & {
  customerId: string;
  storeId: string | null;
  vendorId: string | null;
  cityId: string | null;
  payableAmount: number | null;
  refundedAmount: number;
  paidAt: string | null;
  failedAt: string | null;
};

export type PaymentListQuery = {
  page?: number;
  limit?: number;
  customerId?: string;
  orderId?: string;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  paymentStatus?: PaymentStatus;
  gateway?: PaymentGateway;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export type AdminPaymentActor = {
  userId: string;
  role: string | null;
  cityId: string | null;
  storeId: string | null;
  permissions: string[];
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
