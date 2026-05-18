import type { InventoryMovementRecord } from '../models/inventory-movement.model';

export type InventoryMovementResponse = {
  id: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  inventoryStockId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  movementType: InventoryMovementRecord['movementType'];
  quantity: number;
  previousAvailableQuantity: number;
  newAvailableQuantity: number;
  previousReservedQuantity: number;
  newReservedQuantity: number;
  previousTotalQuantity: number;
  newTotalQuantity: number;
  reason: string;
  referenceType: InventoryMovementRecord['referenceType'];
  referenceId: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdBy: string | null;
  createdAt: Date;
};

export const toInventoryMovementResponse = (
  record: InventoryMovementRecord & { _id: { toString(): string } },
): InventoryMovementResponse => ({
  id: record._id.toString(),
  storeId: record.storeId.toString(),
  vendorId: record.vendorId.toString(),
  cityId: record.cityId.toString(),
  inventoryStockId: record.inventoryStockId.toString(),
  storeProductId: record.storeProductId.toString(),
  productId: record.productId.toString(),
  variantId: record.variantId.toString(),
  movementType: record.movementType,
  quantity: record.quantity,
  previousAvailableQuantity: record.previousAvailableQuantity,
  newAvailableQuantity: record.newAvailableQuantity,
  previousReservedQuantity: record.previousReservedQuantity,
  newReservedQuantity: record.newReservedQuantity,
  previousTotalQuantity: record.previousTotalQuantity,
  newTotalQuantity: record.newTotalQuantity,
  reason: record.reason,
  referenceType: record.referenceType,
  referenceId: record.referenceId,
  notes: record.notes,
  metadata: record.metadata,
  createdBy: record.createdBy?.toString() ?? null,
  createdAt: record.createdAt,
});
