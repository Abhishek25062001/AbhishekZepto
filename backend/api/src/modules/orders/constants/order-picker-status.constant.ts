export const ORDER_PICKER_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const ORDER_PICKER_STATUS_VALUES = [
  ORDER_PICKER_STATUS.IN_PROGRESS,
  ORDER_PICKER_STATUS.COMPLETED,
] as const;

export type OrderPickerStatus = (typeof ORDER_PICKER_STATUS_VALUES)[number];
