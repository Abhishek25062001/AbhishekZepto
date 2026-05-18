import type { CatalogStatus } from '../constants/catalog-status.constants';
import type { FoodType, ProductApprovalStatus, ProductType } from '../constants/product.constants';

export type ProductResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: string;
  subcategoryId: string | null;
  brandId: string | null;
  productType: ProductType;
  foodType: FoodType | null;
  taxCategoryId: string | null;
  hsnCode: string | null;
  searchKeywords: string[];
  tags: string[];
  defaultImageUrl: string | null;
  imageUrls: string[];
  attributeSummary: Record<string, unknown> | null;
  isFeatured: boolean;
  isVisible: boolean;
  approvalStatus: ProductApprovalStatus;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormValues = {
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  productType: ProductType;
  foodType?: FoodType;
  taxCategoryId?: string;
  hsnCode?: string;
  searchKeywords?: string[];
  tags?: string[];
  defaultImageMediaFileId?: string;
  defaultImageUrl?: string;
  imageUrls?: string[];
  attributeSummary?: Record<string, unknown>;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
};

export type ProductListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  approvalStatus?: ProductApprovalStatus;
  status?: CatalogStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  foodType?: FoodType;
  productType?: ProductType;
  sortBy?:
    | 'name'
    | 'createdAt'
    | 'updatedAt'
    | 'relevance'
    | 'newest'
    | 'featured'
    | 'name_asc'
    | 'name_desc'
    | 'updated_desc';
  sortOrder?: 'asc' | 'desc';
};

export type ProductApprovalPayload = {
  approvalStatus: ProductApprovalStatus;
  rejectionReason?: string;
};
