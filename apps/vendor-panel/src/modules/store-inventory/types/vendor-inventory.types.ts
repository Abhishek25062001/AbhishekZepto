import type {
  InventoryStockStatus,
  InventoryMovementType,
  InventoryReferenceType,
} from '../constants/vendor-inventory.constants';

export type VendorInventoryStock = {
  id: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  sku: string;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  expiredQuantity: number;
  totalQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  status: InventoryStockStatus;
  createdAt: string;
  updatedAt: string;
};

export type VendorInventoryMovement = {
  id: string;
  inventoryStockId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  movementType: InventoryMovementType;
  quantity: number;
  referenceType: InventoryReferenceType;
  referenceId: string | null;
  reason: string | null;
  notes: string | null;
  createdAt: string;
};

export type VendorInventoryAdjustmentPayload = {
  movementType: InventoryMovementType;
  quantity: number;
  reason: string;
  notes?: string;
};

export type VendorInventoryStockListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  storeProductId?: string;
  productId?: string;
  variantId?: string;
  sku?: string;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  status?: InventoryStockStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'availableQuantity';
  sortOrder?: 'asc' | 'desc';
};

export type VendorInventoryMovementListQuery = {
  page?: number;
  limit?: number;
  inventoryStockId?: string;
  storeProductId?: string;
  productId?: string;
  variantId?: string;
  movementType?: InventoryMovementType;
  referenceType?: InventoryReferenceType;
  referenceId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'createdAt' | 'quantity';
  sortOrder?: 'asc' | 'desc';
};
