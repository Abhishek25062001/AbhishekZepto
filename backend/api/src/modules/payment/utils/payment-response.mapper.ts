import type {
  AdminPaymentResponse,
  CreatePaymentOrderResponse,
  CustomerPaymentResponse,
  PaymentRecord,
  VerifyPaymentResponse,
} from '../types/payment.types';

const toIso = (value: Date | null | undefined): string | null =>
  value ? value.toISOString() : null;

export const toCreatePaymentOrderResponse = (
  payment: PaymentRecord & { _id: { toString(): string } },
  keyId: string,
): CreatePaymentOrderResponse => ({
  paymentId: payment._id.toString(),
  razorpayOrderId: payment.gatewayOrderId,
  amount: payment.amount,
  currency: payment.currency,
  keyId,
});

export const toVerifyPaymentResponse = (
  payment: PaymentRecord & { _id: { toString(): string } },
  orderId?: string | null,
): VerifyPaymentResponse => ({
  paymentId: payment._id.toString(),
  status: 'paid',
  orderId: orderId ?? payment.orderId?.toString() ?? null,
});

export const toCustomerPaymentResponse = (
  payment: PaymentRecord & { _id: { toString(): string } },
): CustomerPaymentResponse => ({
  paymentId: payment._id.toString(),
  orderId: payment.orderId?.toString() ?? null,
  gateway: payment.gateway,
  gatewayOrderId: payment.gatewayOrderId,
  gatewayPaymentId: payment.gatewayPaymentId,
  amount: payment.amount,
  currency: payment.currency,
  status: payment.status,
  createdAt: payment.createdAt.toISOString(),
  updatedAt: payment.updatedAt.toISOString(),
});

export const toAdminPaymentResponse = (
  payment: PaymentRecord & { _id: { toString(): string } },
): AdminPaymentResponse => ({
  ...toCustomerPaymentResponse(payment),
  customerId: payment.customerId.toString(),
  storeId: payment.storeId?.toString() ?? null,
  vendorId: payment.vendorId?.toString() ?? null,
  cityId: payment.cityId?.toString() ?? null,
  payableAmount: payment.payableAmount,
  refundedAmount: payment.refundedAmount ?? 0,
  paidAt: toIso(payment.paidAt),
  failedAt: toIso(payment.failedAt),
});
