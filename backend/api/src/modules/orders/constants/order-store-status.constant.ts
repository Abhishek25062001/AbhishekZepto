export const ORDER_STORE_STATUS = {
  PENDING_ACCEPTANCE: 'pending_acceptance',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const ORDER_STORE_STATUS_VALUES = [
  ORDER_STORE_STATUS.PENDING_ACCEPTANCE,
  ORDER_STORE_STATUS.ACCEPTED,
  ORDER_STORE_STATUS.REJECTED,
] as const;

export type OrderStoreStatus = (typeof ORDER_STORE_STATUS_VALUES)[number];
