export const ORDER_STATUS = {
  PLACED: 'placed',
  ACCEPTED: 'accepted',
  PICKING: 'picking',
  PACKING: 'packing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_VALUES = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PICKING,
  ORDER_STATUS.PACKING,
  ORDER_STATUS.READY_FOR_PICKUP,
  ORDER_STATUS.CANCELLED,
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
