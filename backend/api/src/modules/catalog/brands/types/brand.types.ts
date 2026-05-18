import type { Types } from 'mongoose';
import type { BrandRecord } from '../models/brand.model';
import type { BrandStatus } from '../constants/brand-status.constant';

export type { BrandStatus };

export type BrandDocument = BrandRecord & {
  _id: Types.ObjectId;
};

export type CreateBrandInput = {
  name: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  logoMediaFileId?: string;
  bannerMediaFileId?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  status?: BrandStatus;
};

export type UpdateBrandInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  logoMediaFileId?: string;
  bannerMediaFileId?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  status?: BrandStatus;
};

export type BrandListQuery = {
  page: number;
  limit: number;
  status?: BrandStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export type BrandResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: BrandStatus;
  createdAt: Date;
  updatedAt: Date;
};
