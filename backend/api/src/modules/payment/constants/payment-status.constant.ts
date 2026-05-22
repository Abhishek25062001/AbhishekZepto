export const PAYMENT_STATUS = {
  CREATED: 'created',
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS_VALUES = [
  PAYMENT_STATUS.CREATED,
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.FAILED,
  PAYMENT_STATUS.CANCELLED,
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number];
