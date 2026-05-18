import type { CatalogStatus } from '../constants/catalog-status.constants';

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
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type CategoryFormValues = {
  name: string;
  description?: string;
  parentCategoryId?: string;
  displayOrder?: number;
  iconMediaFileId?: string;
  bannerMediaFileId?: string;
  iconUrl?: string;
  bannerUrl?: string;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
};

export type CategoryListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CatalogStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  parentCategoryId?: string;
  sortBy?: 'displayOrder' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
