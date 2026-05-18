import type { MovementType, ReferenceType } from '../constants/inventory.constants';

export type InventoryMovementResponse = {
  id: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  inventoryStockId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  movementType: MovementType;
  quantity: number;
  previousAvailableQuantity: number;
  newAvailableQuantity: number;
  previousReservedQuantity: number;
  newReservedQuantity: number;
  previousTotalQuantity: number;
  newTotalQuantity: number;
  reason: string;
  referenceType: ReferenceType;
  referenceId: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type InventoryMovementListQuery = {
  page?: number;
  limit?: number;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  inventoryStockId?: string;
  storeProductId?: string;
  productId?: string;
  variantId?: string;
  movementType?: MovementType;
  referenceType?: ReferenceType;
  referenceId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
};
