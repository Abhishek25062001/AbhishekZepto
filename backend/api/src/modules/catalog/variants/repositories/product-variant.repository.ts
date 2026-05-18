import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { ProductVariantModel, type ProductVariantRecord } from '../models/product-variant.model';
import type { ProductVariantListQuery } from '../types/product-variant.types';

const notDeletedFilter = { isDeleted: false };

export const findProductVariantById = async (
  variantId: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(variantId)) {
    return null;
  }

  return ProductVariantModel.findOne({
    _id: new Types.ObjectId(variantId),
    ...notDeletedFilter,
  }).lean();
};

export const findProductVariantByProductAndId = async (
  productId: string,
  variantId: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(variantId)) {
    return null;
  }

  return ProductVariantModel.findOne({
    _id: new Types.ObjectId(variantId),
    productId: new Types.ObjectId(productId),
    ...notDeletedFilter,
  }).lean();
};

export const findProductVariantBySku = async (
  sku: string,
  excludeId?: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<ProductVariantRecord> = {
    sku,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return ProductVariantModel.findOne(filter).lean();
};

export const findProductVariantByBarcode = async (
  barcode: string,
  excludeId?: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<ProductVariantRecord> = {
    barcode,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return ProductVariantModel.findOne(filter).lean();
};

export const createProductVariant = async (
  payload: Partial<ProductVariantRecord>,
): Promise<ProductVariantRecord & { _id: Types.ObjectId }> => {
  const created = await ProductVariantModel.create(payload);
  return created.toObject() as ProductVariantRecord & { _id: Types.ObjectId };
};

export const updateProductVariantById = async (
  variantId: string,
  payload: Partial<ProductVariantRecord>,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(variantId)) {
    return null;
  }

  return ProductVariantModel.findOneAndUpdate(
    { _id: new Types.ObjectId(variantId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteProductVariantById = async (
  variantId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(variantId)) {
    return null;
  }

  return ProductVariantModel.findOneAndUpdate(
    { _id: new Types.ObjectId(variantId), ...notDeletedFilter },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'archived',
        isDefault: false,
        updatedBy,
      },
    },
    { new: true },
  ).lean();
};

export const listProductVariantsByProductId = async (
  productId: string,
  query: ProductVariantListQuery,
): Promise<{
  items: (ProductVariantRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  if (!Types.ObjectId.isValid(productId)) {
    return { items: [], total: 0 };
  }

  const filter: FilterQuery<ProductVariantRecord> = {
    productId: new Types.ObjectId(productId),
    ...notDeletedFilter,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isVisible === 'boolean') {
    filter.isVisible = query.isVisible;
  }

  if (typeof query.isDefault === 'boolean') {
    filter.isDefault = query.isDefault;
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    ProductVariantModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    ProductVariantModel.countDocuments(filter),
  ]);

  return {
    items: items as (ProductVariantRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const countActiveVariantsByProduct = async (productId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(productId)) {
    return 0;
  }

  return ProductVariantModel.countDocuments({
    productId: new Types.ObjectId(productId),
    ...notDeletedFilter,
  });
};

export const countVariantsUsingUnit = async (unitCode: string): Promise<number> => {
  return ProductVariantModel.countDocuments({
    unit: unitCode.trim().toLowerCase(),
    ...notDeletedFilter,
  });
};

export const clearDefaultVariantForProduct = async (
  productId: string,
  excludeVariantId?: string,
): Promise<void> => {
  if (!Types.ObjectId.isValid(productId)) {
    return;
  }

  const filter: FilterQuery<ProductVariantRecord> = {
    productId: new Types.ObjectId(productId),
    isDefault: true,
    ...notDeletedFilter,
  };

  if (excludeVariantId && Types.ObjectId.isValid(excludeVariantId)) {
    filter._id = { $ne: new Types.ObjectId(excludeVariantId) };
  }

  await ProductVariantModel.updateMany(filter, { $set: { isDefault: false } });
};

export const findDefaultVariantForProduct = async (
  productId: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  return ProductVariantModel.findOne({
    productId: new Types.ObjectId(productId),
    isDefault: true,
    ...notDeletedFilter,
  }).lean();
};

export const findOldestActiveVariantForProduct = async (
  productId: string,
  excludeVariantId: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(excludeVariantId)) {
    return null;
  }

  return ProductVariantModel.findOne({
    productId: new Types.ObjectId(productId),
    _id: { $ne: new Types.ObjectId(excludeVariantId) },
    ...notDeletedFilter,
  })
    .sort({ createdAt: 1 })
    .lean();
};

export const setDefaultVariantById = async (
  variantId: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(variantId)) {
    return null;
  }

  return ProductVariantModel.findOneAndUpdate(
    { _id: new Types.ObjectId(variantId), ...notDeletedFilter },
    { $set: { isDefault: true } },
    { new: true },
  ).lean();
};
