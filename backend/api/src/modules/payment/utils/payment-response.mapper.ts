import type {
  CreatePaymentOrderResponse,
  PaymentRecord,
  VerifyPaymentResponse,
} from '../types/payment.types';

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
