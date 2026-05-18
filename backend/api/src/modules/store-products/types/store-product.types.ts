import type { Types } from 'mongoose';
import type { StoreProductRecord } from '../models/store-product.model';
import type { StoreProductDiscountType } from '../constants/store-product-discount-type.constant';
import type { StoreProductStatus } from '../constants/store-product-status.constant';
import type { StoreProductBulkDuplicateMode } from '../constants/store-product-bulk-duplicate-mode.constant';

export type { StoreProductStatus, StoreProductDiscountType, StoreProductBulkDuplicateMode };

export type StoreProductDocument = StoreProductRecord & {
  _id: Types.ObjectId;
};

export type CreateStoreProductInput = {
  storeId: string;
  productId: string;
  variantId: string;
  storeSku?: string | null;
  mrp: number;
  sellingPrice: number;
  discountType?: StoreProductDiscountType;
  discountValue?: number;
  isAvailable?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  isPriceLocked?: boolean;
  status?: StoreProductStatus;
};

export type UpdateStoreProductInput = {
  storeSku?: string | null;
  mrp?: number;
  sellingPrice?: number;
  discountType?: StoreProductDiscountType;
  discountValue?: number;
  isAvailable?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  isPriceLocked?: boolean;
  status?: StoreProductStatus;
};

export type StoreProductListQuery = {
  page: number;
  limit: number;
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
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'finalPrice' | 'sellingPrice';
  sortOrder?: 'asc' | 'desc';
};

export type BulkMapStoreProductItemInput = {
  productId: string;
  variantId: string;
  storeSku?: string | null;
  mrp: number;
  sellingPrice: number;
  discountType?: StoreProductDiscountType;
  discountValue?: number;
  isAvailable?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
};

export type BulkMapStoreProductsInput = {
  storeId: string;
  items: BulkMapStoreProductItemInput[];
  duplicateMode?: StoreProductBulkDuplicateMode;
};

export type BulkUpdateStoreProductPriceInput = {
  storeProductIds: string[];
  mrp?: number;
  sellingPrice?: number;
  discountType?: StoreProductDiscountType;
  discountValue?: number;
};

export type BulkUpdateStoreProductVisibilityInput = {
  storeProductIds: string[];
  isAvailable?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  status?: StoreProductStatus;
};

export type VendorUpdateStoreProductAvailabilityInput = {
  isAvailable?: boolean;
  isVisible?: boolean;
  status?: StoreProductStatus;
};

export type VendorUpdateStoreProductPriceInput = {
  mrp?: number;
  sellingPrice?: number;
  discountType?: StoreProductDiscountType;
  discountValue?: number;
};

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
  discountType: StoreProductDiscountType;
  discountValue: number;
  finalPrice: number;
  taxCategoryId: string | null;
  isAvailable: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  isPriceLocked: boolean;
  priceUpdatedAt: Date | null;
  availabilityUpdatedAt: Date | null;
  status: StoreProductStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type BulkMapStoreProductsResult = {
  created: number;
  skipped: number;
  failed: number;
  errors: Array<{ index: number; message: string; code?: string }>;
};
