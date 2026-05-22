export const CART_STATUS = {
  ACTIVE: 'active',
  ABANDONED: 'abandoned',
  CONVERTED: 'converted',
} as const;

export type CartStatus = (typeof CART_STATUS)[keyof typeof CART_STATUS];

export const CART_STATUS_VALUES = [
  CART_STATUS.ACTIVE,
  CART_STATUS.ABANDONED,
  CART_STATUS.CONVERTED,
] as const;
