import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { InventoryStockModel, type InventoryStockRecord } from '../models/inventory-stock.model';
import type { InventoryStockListQuery } from '../types/inventory-stock.types';

const notDeletedFilter = { isDeleted: false };

export const findInventoryStockById = async (
  inventoryStockId: string,
): Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(inventoryStockId)) {
    return null;
  }

  return InventoryStockModel.findOne({
    _id: new Types.ObjectId(inventoryStockId),
    ...notDeletedFilter,
  }).lean();
};

export const findInventoryStockByStoreProduct = async (
  storeId: string,
  storeProductId: string,
  excludeId?: string,
): Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeId) || !Types.ObjectId.isValid(storeProductId)) {
    return null;
  }

  const filter: FilterQuery<InventoryStockRecord> = {
    storeId: new Types.ObjectId(storeId),
    storeProductId: new Types.ObjectId(storeProductId),
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return InventoryStockModel.findOne(filter).lean();
};

export const createInventoryStock = async (
  payload: Partial<InventoryStockRecord>,
): Promise<InventoryStockRecord & { _id: Types.ObjectId }> => {
  const created = await InventoryStockModel.create(payload);
  return created.toObject() as InventoryStockRecord & { _id: Types.ObjectId };
};

export const updateInventoryStockById = async (
  inventoryStockId: string,
  payload: Partial<InventoryStockRecord>,
): Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(inventoryStockId)) {
    return null;
  }

  return InventoryStockModel.findOneAndUpdate(
    { _id: new Types.ObjectId(inventoryStockId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteInventoryStockById = async (
  inventoryStockId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(inventoryStockId)) {
    return null;
  }

  return InventoryStockModel.findOneAndUpdate(
    { _id: new Types.ObjectId(inventoryStockId), ...notDeletedFilter },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'archived',
        updatedBy,
      },
    },
    { new: true },
  ).lean();
};

export const listInventoryStocks = async (
  query: InventoryStockListQuery,
): Promise<{
  items: (InventoryStockRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<InventoryStockRecord> = { ...notDeletedFilter };

  if (query.storeId && Types.ObjectId.isValid(query.storeId)) {
    filter.storeId = new Types.ObjectId(query.storeId);
  }
  if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
    filter.vendorId = new Types.ObjectId(query.vendorId);
  }
  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
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
  if (query.sku?.trim()) {
    filter.sku = query.sku.trim().toUpperCase();
  }
  if (query.isLowStock !== undefined) {
    filter.isLowStock = query.isLowStock;
  }
  if (query.isOutOfStock !== undefined) {
    filter.isOutOfStock = query.isOutOfStock;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.search?.trim()) {
    const search = query.search.trim();
    filter.$or = [{ sku: { $regex: search, $options: 'i' } }, { storeSku: { $regex: search, $options: 'i' } }];
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    InventoryStockModel.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(query.limit).lean(),
    InventoryStockModel.countDocuments(filter),
  ]);

  return { items, total };
};

export const countInventoryStocksByStoreProduct = async (storeProductId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(storeProductId)) {
    return 0;
  }

  return InventoryStockModel.countDocuments({
    storeProductId: new Types.ObjectId(storeProductId),
    ...notDeletedFilter,
  });
};

export const bulkCreateInventoryStocks = async (
  records: Partial<InventoryStockRecord>[],
): Promise<(InventoryStockRecord & { _id: Types.ObjectId })[]> => {
  const created = await InventoryStockModel.insertMany(records);
  return created.map((doc) => doc.toObject() as InventoryStockRecord & { _id: Types.ObjectId });
};

export const bulkUpdateInventoryThresholds = async (
  inventoryStockIds: string[],
  payload: Pick<InventoryStockRecord, 'lowStockThreshold' | 'reorderLevel' | 'isLowStock' | 'isOutOfStock' | 'updatedBy'>,
): Promise<number> => {
  const ids = inventoryStockIds.filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));

  if (ids.length === 0) {
    return 0;
  }

  const result = await InventoryStockModel.updateMany(
    { _id: { $in: ids }, ...notDeletedFilter },
    { $set: payload },
  );

  return result.modifiedCount;
};
