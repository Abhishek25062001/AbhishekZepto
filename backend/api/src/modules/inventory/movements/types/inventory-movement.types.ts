import type { InventoryMovementType } from '../constants/inventory-movement-type.constant';
import type { InventoryReferenceType } from '../constants/inventory-reference-type.constant';

export type InventoryMovementListQuery = {
  page: number;
  limit: number;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  inventoryStockId?: string;
  storeProductId?: string;
  productId?: string;
  variantId?: string;
  movementType?: InventoryMovementType;
  referenceType?: InventoryReferenceType;
  referenceId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export type CreateInventoryMovementInput = {
  storeId: string;
  vendorId: string;
  cityId: string;
  inventoryStockId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  movementType: InventoryMovementType;
  quantity: number;
  previousAvailableQuantity: number;
  newAvailableQuantity: number;
  previousReservedQuantity: number;
  newReservedQuantity: number;
  previousTotalQuantity: number;
  newTotalQuantity: number;
  reason: string;
  referenceType: InventoryReferenceType;
  referenceId?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  createdBy?: string | null;
};
