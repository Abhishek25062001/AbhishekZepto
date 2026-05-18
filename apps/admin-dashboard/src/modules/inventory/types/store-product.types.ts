import type { DiscountType, StoreProductStatus } from '../constants/store-product.constants';

export type StoreProductResponse = {
  id: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  productId: string;
  variantId: string;
  categoryId: string;
  brandId: string | null;
  sku: string;
  storeSku: string | null;
  mrp: number;
  sellingPrice: number;
  discountType: DiscountType;
  discountValue: number;
  finalPrice: number;
  taxCategoryId: string | null;
  isAvailable: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  isPriceLocked: boolean;
  priceUpdatedAt: string | null;
  availabilityUpdatedAt: string | null;
  status: StoreProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type StoreProductFormValues = {
  storeId: string;
  productId: string;
  variantId: string;
  storeSku?: string | null;
  mrp: number;
  sellingPrice: number;
  discountType: DiscountType;
  discountValue?: number;
  taxCategoryId?: string | null;
  isAvailable: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  status: StoreProductStatus;
};

export type StoreProductListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  productId?: string;
  variantId?: string;
  categoryId?: string;
  brandId?: string;
  status?: StoreProductStatus;
  isAvailable?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'finalPrice';
  sortOrder?: 'asc' | 'desc';
};

export type BulkStoreProductMapItem = {
  storeId: string;
  productId: string;
  variantId: string;
  mrp: number;
  sellingPrice: number;
  discountType?: DiscountType;
  discountValue?: number;
  isAvailable?: boolean;
  isVisible?: boolean;
};

export type BulkStoreProductMapPayload = { items: BulkStoreProductMapItem[] };

export type BulkStoreProductPriceItem = {
  storeProductId: string;
  mrp?: number;
  sellingPrice: number;
  discountType?: DiscountType;
  discountValue?: number;
};

export type BulkStoreProductPricePayload = { items: BulkStoreProductPriceItem[] };

export type BulkStoreProductVisibilityItem = {
  storeProductId: string;
  isAvailable?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
};

export type BulkStoreProductVisibilityPayload = { items: BulkStoreProductVisibilityItem[] };

export type BulkOperationSummary = {
  created?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
};
