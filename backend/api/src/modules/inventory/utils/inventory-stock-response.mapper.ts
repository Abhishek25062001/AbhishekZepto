import type { InventoryStockRecord } from '../models/inventory-stock.model';

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
  lastStockUpdatedAt: Date | null;
  lastStockMovementId: string | null;
  status: InventoryStockRecord['status'];
  createdAt: Date;
  updatedAt: Date;
};

export const toInventoryStockResponse = (
  record: InventoryStockRecord & { _id: { toString(): string } },
): InventoryStockResponse => ({
  id: record._id.toString(),
  storeId: record.storeId.toString(),
  vendorId: record.vendorId.toString(),
  cityId: record.cityId.toString(),
  storeProductId: record.storeProductId.toString(),
  productId: record.productId.toString(),
  variantId: record.variantId.toString(),
  sku: record.sku,
  storeSku: record.storeSku,
  availableQuantity: record.availableQuantity,
  reservedQuantity: record.reservedQuantity,
  damagedQuantity: record.damagedQuantity,
  expiredQuantity: record.expiredQuantity,
  totalQuantity: record.totalQuantity,
  lowStockThreshold: record.lowStockThreshold,
  reorderLevel: record.reorderLevel,
  isLowStock: record.isLowStock,
  isOutOfStock: record.isOutOfStock,
  lastStockUpdatedAt: record.lastStockUpdatedAt,
  lastStockMovementId: record.lastStockMovementId?.toString() ?? null,
  status: record.status,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});
