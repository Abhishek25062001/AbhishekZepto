import type { InventoryLockRecord } from '../models/inventory-lock.model';

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
  lockType: InventoryLockRecord['lockType'];
  quantity: number;
  status: InventoryLockRecord['status'];
  expiresAt: Date;
  releasedAt: Date | null;
  confirmedAt: Date | null;
  releaseReason: string | null;
  confirmationReason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export const toInventoryLockResponse = (
  record: InventoryLockRecord & { _id: { toString(): string } },
): InventoryLockResponse => ({
  id: record._id.toString(),
  storeId: record.storeId.toString(),
  vendorId: record.vendorId.toString(),
  cityId: record.cityId.toString(),
  inventoryStockId: record.inventoryStockId.toString(),
  storeProductId: record.storeProductId.toString(),
  productId: record.productId.toString(),
  variantId: record.variantId.toString(),
  customerId: record.customerId?.toString() ?? null,
  cartId: record.cartId?.toString() ?? null,
  orderId: record.orderId?.toString() ?? null,
  lockToken: record.lockToken,
  lockType: record.lockType,
  quantity: record.quantity,
  status: record.status,
  expiresAt: record.expiresAt,
  releasedAt: record.releasedAt,
  confirmedAt: record.confirmedAt,
  releaseReason: record.releaseReason,
  confirmationReason: record.confirmationReason,
  metadata: record.metadata,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});
