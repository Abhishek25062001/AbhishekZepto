import type { Types } from 'mongoose';
import type { FoodType } from '../constants/food-type.constant';
import type { ProductApprovalStatus } from '../constants/product-approval-status.constant';
import type { ProductStatus } from '../constants/product-status.constant';
import type { ProductType } from '../constants/product-type.constant';
import type { ProductRecord } from '../models/product.model';

export type { FoodType, ProductApprovalStatus, ProductStatus, ProductType };

export type ProductDocument = ProductRecord & {
  _id: Types.ObjectId;
};

export type CreateProductInput = {
  name: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  categoryId: string;
  subcategoryId?: string | null;
  brandId?: string | null;
  productType: ProductType;
  foodType?: FoodType | null;
  taxCategoryId?: string | null;
  hsnCode?: string | null;
  searchKeywords?: string[];
  tags?: string[];
  defaultImageUrl?: string | null;
  defaultImageMediaFileId?: string;
  imageUrls?: string[];
  attributeSummary?: Record<string, unknown> | null;
  isFeatured?: boolean;
  isVisible?: boolean;
  status?: ProductStatus;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type UpdateProductApprovalInput = {
  approvalStatus: ProductApprovalStatus;
  rejectionReason?: string | null;
};

export type ProductListQuery = {
  page: number;
  limit: number;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  approvalStatus?: ProductApprovalStatus;
  status?: ProductStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  foodType?: FoodType;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

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
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};
