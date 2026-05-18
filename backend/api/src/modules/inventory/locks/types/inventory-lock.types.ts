import type { InventoryLockStatus } from '../constants/inventory-lock-status.constant';
import type { InventoryLockType } from '../constants/inventory-lock-type.constant';

export type CreateInventoryLockInput = {
  inventoryStockId: string;
  storeProductId: string;
  quantity: number;
  lockType: InventoryLockType;
  customerId?: string;
  cartId?: string;
  orderId?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
};

export type ReleaseInventoryLockInput = {
  lockToken: string;
  releaseReason: string;
  metadata?: Record<string, unknown>;
};

export type ConfirmInventoryLockInput = {
  lockToken: string;
  confirmationReason: string;
  orderId?: string;
  metadata?: Record<string, unknown>;
};

export type InventoryLockListQuery = {
  page: number;
  limit: number;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  inventoryStockId?: string;
  storeProductId?: string;
  customerId?: string;
  cartId?: string;
  orderId?: string;
  lockType?: InventoryLockType;
  status?: InventoryLockStatus;
  expiresBefore?: string;
  expiresAfter?: string;
  sortBy?: 'createdAt' | 'expiresAt';
  sortOrder?: 'asc' | 'desc';
};

export type ExpireDueLocksSummary = {
  processedCount: number;
  expiredCount: number;
  failedCount: number;
  errors: Array<{ lockId: string; message: string }>;
};
