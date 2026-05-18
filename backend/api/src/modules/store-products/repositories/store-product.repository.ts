import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { StoreProductModel, type StoreProductRecord } from '../models/store-product.model';
import type { StoreProductListQuery } from '../types/store-product.types';

const notDeletedFilter = { isDeleted: false };

export const findStoreProductById = async (
  storeProductId: string,
): Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeProductId)) {
    return null;
  }

  return StoreProductModel.findOne({
    _id: new Types.ObjectId(storeProductId),
    ...notDeletedFilter,
  }).lean();
};

export const findStoreProductByStoreAndVariant = async (
  storeId: string,
  variantId: string,
  excludeId?: string,
): Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeId) || !Types.ObjectId.isValid(variantId)) {
    return null;
  }

  const filter: FilterQuery<StoreProductRecord> = {
    storeId: new Types.ObjectId(storeId),
    variantId: new Types.ObjectId(variantId),
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return StoreProductModel.findOne(filter).lean();
};

export const findStoreProductByStoreSku = async (
  storeId: string,
  storeSku: string,
  excludeId?: string,
): Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeId) || !storeSku.trim()) {
    return null;
  }

  const filter: FilterQuery<StoreProductRecord> = {
    storeId: new Types.ObjectId(storeId),
    storeSku: storeSku.trim(),
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return StoreProductModel.findOne(filter).lean();
};

export const createStoreProduct = async (
  payload: Partial<StoreProductRecord>,
): Promise<StoreProductRecord & { _id: Types.ObjectId }> => {
  const created = await StoreProductModel.create(payload);
  return created.toObject() as StoreProductRecord & { _id: Types.ObjectId };
};

export const updateStoreProductById = async (
  storeProductId: string,
  payload: Partial<StoreProductRecord>,
): Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeProductId)) {
    return null;
  }

  return StoreProductModel.findOneAndUpdate(
    { _id: new Types.ObjectId(storeProductId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteStoreProductById = async (
  storeProductId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeProductId)) {
    return null;
  }

  return StoreProductModel.findOneAndUpdate(
    { _id: new Types.ObjectId(storeProductId), ...notDeletedFilter },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'archived',
        isAvailable: false,
        isVisible: false,
        updatedBy,
      },
    },
    { new: true },
  ).lean();
};

export const listStoreProducts = async (
  query: StoreProductListQuery,
): Promise<{
  items: (StoreProductRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<StoreProductRecord> = { ...notDeletedFilter };

  if (query.storeId && Types.ObjectId.isValid(query.storeId)) {
    filter.storeId = new Types.ObjectId(query.storeId);
  }
  if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
    filter.vendorId = new Types.ObjectId(query.vendorId);
  }
  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
  }
  if (query.productId && Types.ObjectId.isValid(query.productId)) {
    filter.productId = new Types.ObjectId(query.productId);
  }
  if (query.variantId && Types.ObjectId.isValid(query.variantId)) {
    filter.variantId = new Types.ObjectId(query.variantId);
  }
  if (query.categoryId && Types.ObjectId.isValid(query.categoryId)) {
    filter.categoryId = new Types.ObjectId(query.categoryId);
  }
  if (query.brandId && Types.ObjectId.isValid(query.brandId)) {
    filter.brandId = new Types.ObjectId(query.brandId);
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (typeof query.isAvailable === 'boolean') {
    filter.isAvailable = query.isAvailable;
  }
  if (typeof query.isVisible === 'boolean') {
    filter.isVisible = query.isVisible;
  }
  if (typeof query.isFeatured === 'boolean') {
    filter.isFeatured = query.isFeatured;
  }
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ sku: searchRegex }, { storeSku: searchRegex }];
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    StoreProductModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    StoreProductModel.countDocuments(filter),
  ]);

  return {
    items: items as (StoreProductRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const bulkCreateStoreProducts = async (
  records: Partial<StoreProductRecord>[],
): Promise<(StoreProductRecord & { _id: Types.ObjectId })[]> => {
  if (records.length === 0) {
    return [];
  }

  const created = await StoreProductModel.insertMany(records);
  return created.map((doc) => doc.toObject() as StoreProductRecord & { _id: Types.ObjectId });
};

export const bulkUpdateStoreProductPrices = async (
  storeProductIds: string[],
  pricePayload: Partial<StoreProductRecord>,
): Promise<number> => {
  const ids = storeProductIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (ids.length === 0) {
    return 0;
  }

  const result = await StoreProductModel.updateMany(
    { _id: { $in: ids }, ...notDeletedFilter },
    { $set: pricePayload },
  );

  return result.modifiedCount;
};

export const bulkUpdateStoreProductVisibility = async (
  storeProductIds: string[],
  visibilityPayload: Partial<StoreProductRecord>,
): Promise<number> => {
  const ids = storeProductIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (ids.length === 0) {
    return 0;
  }

  const result = await StoreProductModel.updateMany(
    { _id: { $in: ids }, ...notDeletedFilter },
    { $set: visibilityPayload },
  );

  return result.modifiedCount;
};

export const countMappedVariantsByStore = async (storeId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return 0;
  }

  return StoreProductModel.countDocuments({
    storeId: new Types.ObjectId(storeId),
    ...notDeletedFilter,
  });
};

export const countStoreProductsByVariant = async (variantId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(variantId)) {
    return 0;
  }

  return StoreProductModel.countDocuments({
    variantId: new Types.ObjectId(variantId),
    ...notDeletedFilter,
  });
};

export const countStoreProductsByProduct = async (productId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(productId)) {
    return 0;
  }

  return StoreProductModel.countDocuments({
    productId: new Types.ObjectId(productId),
    ...notDeletedFilter,
  });
};
