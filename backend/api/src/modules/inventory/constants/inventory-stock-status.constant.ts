export const INVENTORY_STOCK_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export const INVENTORY_STOCK_STATUS_VALUES = [
  INVENTORY_STOCK_STATUS.ACTIVE,
  INVENTORY_STOCK_STATUS.INACTIVE,
  INVENTORY_STOCK_STATUS.ARCHIVED,
] as const;

export type InventoryStockStatus = (typeof INVENTORY_STOCK_STATUS_VALUES)[number];
