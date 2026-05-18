import type { InventoryStockStatus } from '../constants/inventory.constants';

export type InventoryStockResponse = {
  id: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  sku: string;
  storeSku: string | null;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  expiredQuantity: number;
  totalQuantity: number;
  lowStockThreshold: number;
  reorderLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastStockUpdatedAt: string | null;
  lastStockMovementId: string | null;
  status: InventoryStockStatus;
  createdAt: string;
  updatedAt: string;
};

export type InventoryStockFormValues = {
  storeProductId: string;
  availableQuantity: number;
  reservedQuantity?: number;
  damagedQuantity?: number;
  expiredQuantity?: number;
  lowStockThreshold?: number;
  reorderLevel?: number;
  status: InventoryStockStatus;
};

export type InventoryStockListQuery = {
  page?: number;
  limit?: number;
  search?: string;
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
  sortBy?: 'createdAt' | 'updatedAt' | 'totalQuantity';
  sortOrder?: 'asc' | 'desc';
};

export type InventoryAdjustmentPayload = {
  movementType: string;
  quantity: number;
  reason: string;
  adjustmentMode?: string;
  notes?: string;
};

export type BulkInventoryUploadItem = {
  storeProductId: string;
  availableQuantity: number;
  lowStockThreshold?: number;
  reorderLevel?: number;
};

export type BulkInventoryUploadPayload = { items: BulkInventoryUploadItem[] };

export type BulkInventoryThresholdItem = {
  inventoryStockId: string;
  lowStockThreshold?: number;
  reorderLevel?: number;
};

export type BulkInventoryThresholdPayload = { items: BulkInventoryThresholdItem[] };

export type BulkOperationSummary = {
  created?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
};
