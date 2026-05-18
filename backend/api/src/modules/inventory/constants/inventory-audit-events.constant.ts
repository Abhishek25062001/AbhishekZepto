export const INVENTORY_AUDIT_EVENTS = {
  INVENTORY_STOCK_CREATED: 'inventory.stock_created',
  INVENTORY_STOCK_UPDATED: 'inventory.stock_updated',
  INVENTORY_STOCK_DELETED: 'inventory.stock_deleted',
  INVENTORY_STOCK_ADJUSTED: 'inventory.stock_adjusted',
  INVENTORY_BULK_UPLOADED: 'inventory.bulk_uploaded',
  INVENTORY_BULK_THRESHOLDS_UPDATED: 'inventory.bulk_thresholds_updated',
  INVENTORY_VENDOR_STOCK_ADJUSTED: 'inventory.vendor_stock_adjusted',
} as const;
