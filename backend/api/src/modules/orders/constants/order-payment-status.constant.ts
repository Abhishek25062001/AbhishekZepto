export const ORDER_PAYMENT_STATUS = {
  PAID: 'paid',
} as const;

export const ORDER_PAYMENT_STATUS_VALUES = [ORDER_PAYMENT_STATUS.PAID] as const;

export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUS_VALUES)[number];
