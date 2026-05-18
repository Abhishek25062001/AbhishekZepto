import type { CategoryRecord } from '../models/category.model';
import type { CategoryResponse } from '../types/category.types';
import type { CategoryStatus } from '../constants/category-status.constant';
import type { Types } from 'mongoose';

type CategoryLean = CategoryRecord & { _id: Types.ObjectId };

export const toCategoryResponse = (category: CategoryLean): CategoryResponse => ({
  id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description,
  parentCategoryId: category.parentCategoryId ? category.parentCategoryId.toString() : null,
  level: category.level,
  displayOrder: category.displayOrder,
  iconUrl: category.iconUrl,
  bannerUrl: category.bannerUrl,
  isFeatured: category.isFeatured,
  isVisible: category.isVisible,
  status: category.status as CategoryStatus,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});
