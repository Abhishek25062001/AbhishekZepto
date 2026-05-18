import type { InventoryBulkDuplicateMode } from '../constants/inventory-bulk-duplicate-mode.constant';
import type { InventoryAdjustmentMode } from '../constants/inventory-adjustment-mode.constant';
import type { InventoryStockStatus } from '../constants/inventory-stock-status.constant';
import type { InventoryMovementType } from '../movements/constants/inventory-movement-type.constant';
import type { InventoryReferenceType } from '../movements/constants/inventory-reference-type.constant';

export type CreateInventoryStockInput = {
  storeProductId: string;
  availableQuantity: number;
  reservedQuantity?: number;
  damagedQuantity?: number;
  expiredQuantity?: number;
  lowStockThreshold?: number;
  reorderLevel?: number;
};

export type UpdateInventoryStockInput = {
  lowStockThreshold?: number;
  reorderLevel?: number;
  status?: InventoryStockStatus;
};

export type InventoryStockListQuery = {
  page: number;
  limit: number;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  storeProductId?: string;
  productId?: string;
  variantId?: string;
  sku?: string;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  status?: InventoryStockStatus;
  search?: string;
  sortBy?: 'createdAt' | 'availableQuantity' | 'sku';
  sortOrder?: 'asc' | 'desc';
};

export type InventoryAdjustmentInput = {
  movementType: InventoryMovementType;
  quantity: number;
  reason: string;
  referenceType?: InventoryReferenceType;
  referenceId?: string;
  notes?: string;
  adjustmentMode?: InventoryAdjustmentMode;
};

export type BulkInventoryUploadItem = {
  storeProductId: string;
  availableQuantity: number;
  lowStockThreshold?: number;
  reorderLevel?: number;
};

export type BulkInventoryUploadInput = {
  items: BulkInventoryUploadItem[];
  duplicateMode?: InventoryBulkDuplicateMode;
};

export type BulkInventoryThresholdInput = {
  inventoryStockIds: string[];
  lowStockThreshold?: number;
  reorderLevel?: number;
};

export type VendorInventoryScope = {
  vendorId: string | null;
  storeId: string | null;
};
