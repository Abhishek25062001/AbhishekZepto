import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { BrandModel, type BrandRecord } from '../models/brand.model';
import type { BrandListQuery } from '../types/brand.types';

const notDeletedFilter = { isDeleted: false };

export const findBrandById = async (
  brandId: string,
): Promise<(BrandRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(brandId)) {
    return null;
  }

  return BrandModel.findOne({
    _id: new Types.ObjectId(brandId),
    ...notDeletedFilter,
  }).lean();
};

export const findBrandBySlug = async (
  slug: string,
  excludeId?: string,
): Promise<(BrandRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<BrandRecord> = {
    slug,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return BrandModel.findOne(filter).lean();
};

export const createBrand = async (
  payload: Partial<BrandRecord>,
): Promise<BrandRecord & { _id: Types.ObjectId }> => {
  const created = await BrandModel.create(payload);
  return created.toObject() as BrandRecord & { _id: Types.ObjectId };
};

export const updateBrandById = async (
  brandId: string,
  payload: Partial<BrandRecord>,
): Promise<(BrandRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(brandId)) {
    return null;
  }

  return BrandModel.findOneAndUpdate(
    { _id: new Types.ObjectId(brandId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteBrandById = async (
  brandId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(BrandRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(brandId)) {
    return null;
  }

  return BrandModel.findOneAndUpdate(
    { _id: new Types.ObjectId(brandId), ...notDeletedFilter },
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

export const listBrands = async (
  query: BrandListQuery,
): Promise<{
  items: (BrandRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<BrandRecord> = { ...notDeletedFilter };

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isVisible === 'boolean') {
    filter.isVisible = query.isVisible;
  }

  if (typeof query.isFeatured === 'boolean') {
    filter.isFeatured = query.isFeatured;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  const sortField = query.sortBy ?? 'updatedAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    BrandModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    BrandModel.countDocuments(filter),
  ]);

  return {
    items: items as (BrandRecord & { _id: Types.ObjectId })[],
    total,
  };
};
