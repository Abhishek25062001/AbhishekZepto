import type { CatalogStatus } from './customer-category.types';

export type ProductApprovalStatus =
  | 'approved'
  | 'pending_review'
  | 'rejected'
  | 'draft'
  | 'archived';

export type FoodType = 'veg' | 'non_veg' | 'egg' | 'not_applicable' | null;
export type ProductType = 'grocery' | 'pharmacy' | 'general';

export type CustomerProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: string;
  subcategoryId: string | null;
  brandId: string | null;
  productType: ProductType;
  foodType: FoodType;
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
  storeProductId?: string | null;
  variantId?: string | null;
  mrp?: number | null;
  sellingPrice?: number | null;
  discountType?: string | null;
  discountValue?: number | null;
  finalPrice?: number | null;
  isAvailable?: boolean | null;
  isOutOfStock?: boolean | null;
  availableQuantity?: number | null;
};
