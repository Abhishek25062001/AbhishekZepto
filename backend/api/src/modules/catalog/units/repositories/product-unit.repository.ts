import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { ProductUnitModel, type ProductUnitRecord } from '../models/product-unit.model';
import type { ProductUnitListQuery } from '../types/product-unit.types';

const notDeletedFilter = { isDeleted: false };

export const findProductUnitById = async (
  unitId: string,
): Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(unitId)) {
    return null;
  }

  return ProductUnitModel.findOne({
    _id: new Types.ObjectId(unitId),
    ...notDeletedFilter,
  }).lean();
};

export const findProductUnitByCode = async (
  code: string,
  excludeId?: string,
): Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<ProductUnitRecord> = {
    code,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return ProductUnitModel.findOne(filter).lean();
};

export const createProductUnit = async (
  payload: Partial<ProductUnitRecord>,
): Promise<ProductUnitRecord & { _id: Types.ObjectId }> => {
  const created = await ProductUnitModel.create(payload);
  return created.toObject() as ProductUnitRecord & { _id: Types.ObjectId };
};

export const updateProductUnitById = async (
  unitId: string,
  payload: Partial<ProductUnitRecord>,
): Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(unitId)) {
    return null;
  }

  return ProductUnitModel.findOneAndUpdate(
    { _id: new Types.ObjectId(unitId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteProductUnitById = async (
  unitId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(unitId)) {
    return null;
  }

  return ProductUnitModel.findOneAndUpdate(
    { _id: new Types.ObjectId(unitId), ...notDeletedFilter },
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

export const listProductUnits = async (
  query: ProductUnitListQuery,
): Promise<{
  items: (ProductUnitRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<ProductUnitRecord> = { ...notDeletedFilter };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.baseUnit) {
    filter.baseUnit = query.baseUnit;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { code: searchRegex }];
  }

  const sortField = query.sortBy ?? 'updatedAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    ProductUnitModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    ProductUnitModel.countDocuments(filter),
  ]);

  return {
    items: items as (ProductUnitRecord & { _id: Types.ObjectId })[],
    total,
  };
};
