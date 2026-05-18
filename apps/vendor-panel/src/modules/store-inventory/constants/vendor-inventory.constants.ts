export const INVENTORY_STOCK_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type InventoryStockStatus = (typeof INVENTORY_STOCK_STATUS)[keyof typeof INVENTORY_STOCK_STATUS];

export const INVENTORY_STOCK_STATUS_LABELS: Record<InventoryStockStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export const VENDOR_MOVEMENT_TYPE = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  DAMAGED: 'damaged',
  EXPIRED: 'expired',
  CORRECTION: 'correction',
} as const;

export type InventoryMovementType = (typeof VENDOR_MOVEMENT_TYPE)[keyof typeof VENDOR_MOVEMENT_TYPE];

export const VENDOR_MOVEMENT_TYPE_LABELS: Record<InventoryMovementType, string> = {
  stock_in: 'Stock in',
  stock_out: 'Stock out',
  damaged: 'Damaged',
  expired: 'Expired',
  correction: 'Correction',
};

export const VENDOR_MOVEMENT_TYPES = Object.values(VENDOR_MOVEMENT_TYPE);

export const REFERENCE_TYPE = {
  MANUAL: 'manual',
  ORDER: 'order',
  CART: 'cart',
  RETURN: 'return',
  SYSTEM: 'system',
  SEED: 'seed',
  IMPORT: 'import',
} as const;

export type InventoryReferenceType = (typeof REFERENCE_TYPE)[keyof typeof REFERENCE_TYPE];

export const REFERENCE_TYPE_LABELS: Record<InventoryReferenceType, string> = {
  manual: 'Manual',
  order: 'Order',
  cart: 'Cart',
  return: 'Return',
  system: 'System',
  seed: 'Seed',
  import: 'Import',
};

export const STOCK_LEVEL = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  RESERVED: 'reserved',
} as const;

export type StockLevelLabel = (typeof STOCK_LEVEL)[keyof typeof STOCK_LEVEL];

export const STOCK_LEVEL_LABELS: Record<StockLevelLabel, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
  reserved: 'Reserved',
};
