export const INVENTORY_STOCK_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type InventoryStockStatus =
  (typeof INVENTORY_STOCK_STATUS)[keyof typeof INVENTORY_STOCK_STATUS];

export const INVENTORY_STOCK_STATUS_LABELS: Record<InventoryStockStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export const MOVEMENT_TYPE = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
  RESERVATION_CREATED: 'reservation_created',
  RESERVATION_RELEASED: 'reservation_released',
  RESERVATION_CONFIRMED: 'reservation_confirmed',
  DAMAGED: 'damaged',
  EXPIRED: 'expired',
  CORRECTION: 'correction',
} as const;

export type MovementType = (typeof MOVEMENT_TYPE)[keyof typeof MOVEMENT_TYPE];

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  stock_in: 'Stock in',
  stock_out: 'Stock out',
  manual_adjustment: 'Manual adjustment',
  reservation_created: 'Reservation created',
  reservation_released: 'Reservation released',
  reservation_confirmed: 'Reservation confirmed',
  damaged: 'Damaged',
  expired: 'Expired',
  correction: 'Correction',
};

export const REFERENCE_TYPE = {
  MANUAL: 'manual',
  ORDER: 'order',
  CART: 'cart',
  RETURN: 'return',
  SYSTEM: 'system',
  SEED: 'seed',
  IMPORT: 'import',
} as const;

export type ReferenceType = (typeof REFERENCE_TYPE)[keyof typeof REFERENCE_TYPE];

export const LOCK_STATUS = {
  ACTIVE: 'active',
  RELEASED: 'released',
  CONFIRMED: 'confirmed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

export type LockStatus = (typeof LOCK_STATUS)[keyof typeof LOCK_STATUS];

export const LOCK_STATUS_LABELS: Record<LockStatus, string> = {
  active: 'Active',
  released: 'Released',
  confirmed: 'Confirmed',
  expired: 'Expired',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

export const LOCK_TYPE = {
  CART: 'cart',
  CHECKOUT: 'checkout',
  ORDER: 'order',
  MANUAL: 'manual',
  SYSTEM: 'system',
} as const;

export type LockType = (typeof LOCK_TYPE)[keyof typeof LOCK_TYPE];

export const LOCK_TYPE_LABELS: Record<LockType, string> = {
  cart: 'Cart',
  checkout: 'Checkout',
  order: 'Order',
  manual: 'Manual',
  system: 'System',
};

export const ADJUSTMENT_MODE = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  SET: 'set',
} as const;

export type AdjustmentMode = (typeof ADJUSTMENT_MODE)[keyof typeof ADJUSTMENT_MODE];
