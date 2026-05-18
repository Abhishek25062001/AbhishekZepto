import type { DiscountType, StoreProductStatus } from '../constants/vendor-store-product.constants';

export type VendorStoreProduct = {
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

export type VendorAvailabilityUpdatePayload = {
  isAvailable?: boolean;
  isVisible?: boolean;
  status?: StoreProductStatus;
};

export type VendorPriceUpdatePayload = {
  mrp?: number;
  sellingPrice?: number;
  discountType?: DiscountType;
  discountValue?: number;
};

export type VendorStoreProductListQuery = {
  page?: number;
  limit?: number;
  search?: string;
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
