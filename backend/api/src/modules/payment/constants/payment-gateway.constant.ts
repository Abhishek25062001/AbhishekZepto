export const PAYMENT_GATEWAY = {
  RAZORPAY: 'razorpay',
} as const;

export const PAYMENT_GATEWAY_VALUES = [PAYMENT_GATEWAY.RAZORPAY] as const;

export type PaymentGateway = (typeof PAYMENT_GATEWAY_VALUES)[number];
