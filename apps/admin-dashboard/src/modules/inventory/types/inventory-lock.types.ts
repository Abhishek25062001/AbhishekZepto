import type { LockStatus, LockType } from '../constants/inventory.constants';

export type InventoryLockResponse = {
  id: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  inventoryStockId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  customerId: string | null;
  cartId: string | null;
  orderId: string | null;
  lockToken: string;
  lockType: LockType;
  quantity: number;
  status: LockStatus;
  expiresAt: string;
  releasedAt: string | null;
  confirmedAt: string | null;
  releaseReason: string | null;
  confirmationReason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type InventoryLockListQuery = {
  page?: number;
  limit?: number;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  inventoryStockId?: string;
  storeProductId?: string;
  productId?: string;
  variantId?: string;
  customerId?: string;
  cartId?: string;
  orderId?: string;
  lockType?: LockType;
  status?: LockStatus;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'createdAt' | 'expiresAt';
  sortOrder?: 'asc' | 'desc';
};

export type ExpireDueLocksSummary = {
  processed: number;
  expired: number;
  failed: number;
};
