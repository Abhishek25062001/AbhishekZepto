import type { Types } from 'mongoose';
import type { CategoryRecord } from '../models/category.model';
import type { CategoryStatus } from '../constants/category-status.constant';

export type { CategoryStatus };

export type CategoryDocument = CategoryRecord & {
  _id: Types.ObjectId;
};

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  description?: string | null;
  parentCategoryId?: string | null;
  displayOrder?: number;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  iconMediaFileId?: string;
  bannerMediaFileId?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  status?: CategoryStatus;
};

export type UpdateCategoryInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  parentCategoryId?: string | null;
  displayOrder?: number;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  iconMediaFileId?: string;
  bannerMediaFileId?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  status?: CategoryStatus;
};

export type CategoryListQuery = {
  page: number;
  limit: number;
  parentCategoryId?: string;
  status?: CategoryStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'displayOrder' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentCategoryId: string | null;
  level: number;
  displayOrder: number;
  iconUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
};
