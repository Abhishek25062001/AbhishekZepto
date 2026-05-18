import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import {
  InventoryMovementModel,
  type InventoryMovementRecord,
} from '../models/inventory-movement.model';
import type { InventoryMovementListQuery } from '../types/inventory-movement.types';

export const createInventoryMovement = async (
  payload: Partial<InventoryMovementRecord>,
): Promise<InventoryMovementRecord & { _id: Types.ObjectId }> => {
  const created = await InventoryMovementModel.create(payload);
  return created.toObject() as InventoryMovementRecord & { _id: Types.ObjectId };
};

export const findInventoryMovementById = async (
  movementId: string,
): Promise<(InventoryMovementRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(movementId)) {
    return null;
  }

  return InventoryMovementModel.findById(new Types.ObjectId(movementId)).lean();
};

export const listInventoryMovements = async (
  query: InventoryMovementListQuery,
): Promise<{
  items: (InventoryMovementRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<InventoryMovementRecord> = {};

  if (query.storeId && Types.ObjectId.isValid(query.storeId)) {
    filter.storeId = new Types.ObjectId(query.storeId);
  }
  if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
    filter.vendorId = new Types.ObjectId(query.vendorId);
  }
  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
  }
  if (query.inventoryStockId && Types.ObjectId.isValid(query.inventoryStockId)) {
    filter.inventoryStockId = new Types.ObjectId(query.inventoryStockId);
  }
  if (query.storeProductId && Types.ObjectId.isValid(query.storeProductId)) {
    filter.storeProductId = new Types.ObjectId(query.storeProductId);
  }
  if (query.productId && Types.ObjectId.isValid(query.productId)) {
    filter.productId = new Types.ObjectId(query.productId);
  }
  if (query.variantId && Types.ObjectId.isValid(query.variantId)) {
    filter.variantId = new Types.ObjectId(query.variantId);
  }
  if (query.movementType) {
    filter.movementType = query.movementType;
  }
  if (query.referenceType) {
    filter.referenceType = query.referenceType;
  }
  if (query.referenceId?.trim()) {
    filter.referenceId = query.referenceId.trim();
  }
  if (query.fromDate || query.toDate) {
    filter.createdAt = {};
    if (query.fromDate) {
      filter.createdAt.$gte = new Date(query.fromDate);
    }
    if (query.toDate) {
      filter.createdAt.$lte = new Date(query.toDate);
    }
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    InventoryMovementModel.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(query.limit).lean(),
    InventoryMovementModel.countDocuments(filter),
  ]);

  return { items, total };
};
