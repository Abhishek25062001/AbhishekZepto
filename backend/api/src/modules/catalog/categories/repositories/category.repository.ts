import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { CategoryModel, type CategoryRecord } from '../models/category.model';
import type { CategoryListQuery } from '../types/category.types';

const notDeletedFilter = { isDeleted: false };

export const findCategoryById = async (
  categoryId: string,
): Promise<(CategoryRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(categoryId)) {
    return null;
  }

  return CategoryModel.findOne({
    _id: new Types.ObjectId(categoryId),
    ...notDeletedFilter,
  }).lean();
};

export const findCategoryBySlug = async (
  slug: string,
  excludeId?: string,
): Promise<(CategoryRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<CategoryRecord> = {
    slug,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return CategoryModel.findOne(filter).lean();
};

export const createCategory = async (
  payload: Partial<CategoryRecord>,
): Promise<CategoryRecord & { _id: Types.ObjectId }> => {
  const created = await CategoryModel.create(payload);
  return created.toObject() as CategoryRecord & { _id: Types.ObjectId };
};

export const updateCategoryById = async (
  categoryId: string,
  payload: Partial<CategoryRecord>,
): Promise<(CategoryRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(categoryId)) {
    return null;
  }

  return CategoryModel.findOneAndUpdate(
    { _id: new Types.ObjectId(categoryId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteCategoryById = async (
  categoryId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(CategoryRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(categoryId)) {
    return null;
  }

  return CategoryModel.findOneAndUpdate(
    { _id: new Types.ObjectId(categoryId), ...notDeletedFilter },
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

export const countChildCategories = async (parentCategoryId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(parentCategoryId)) {
    return 0;
  }

  return CategoryModel.countDocuments({
    parentCategoryId: new Types.ObjectId(parentCategoryId),
    ...notDeletedFilter,
  });
};

export const listCategories = async (
  query: CategoryListQuery,
): Promise<{
  items: (CategoryRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<CategoryRecord> = { ...notDeletedFilter };

  if (query.parentCategoryId) {
    if (query.parentCategoryId === 'null') {
      filter.parentCategoryId = null;
    } else if (Types.ObjectId.isValid(query.parentCategoryId)) {
      filter.parentCategoryId = new Types.ObjectId(query.parentCategoryId);
    }
  }

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
    CategoryModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    CategoryModel.countDocuments(filter),
  ]);

  return {
    items: items as (CategoryRecord & { _id: Types.ObjectId })[],
    total,
  };
};
