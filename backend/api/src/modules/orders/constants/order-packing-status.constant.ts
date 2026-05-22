export const ORDER_PACKING_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  READY_FOR_PICKUP: 'ready_for_pickup',
} as const;

export const ORDER_PACKING_STATUS_VALUES = [
  ORDER_PACKING_STATUS.IN_PROGRESS,
  ORDER_PACKING_STATUS.COMPLETED,
  ORDER_PACKING_STATUS.READY_FOR_PICKUP,
] as const;

export type OrderPackingStatus = (typeof ORDER_PACKING_STATUS_VALUES)[number];
