import type { CatalogStatus } from '../constants/catalog-status.constants';

export type BrandResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type BrandFormValues = {
  name: string;
  description?: string;
  logoMediaFileId?: string;
  bannerMediaFileId?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
};

export type BrandListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CatalogStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
