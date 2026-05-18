import type { CatalogSortOption } from '../constants/catalog-sort.constant';
import type { FoodType } from '../../products/constants/food-type.constant';
import type { ProductApprovalStatus } from '../../products/constants/product-approval-status.constant';
import type { ProductStatus } from '../../products/constants/product-status.constant';
import type { ProductType } from '../../products/constants/product-type.constant';

export type CatalogSearchSurface = 'admin' | 'vendor' | 'customer';

export type CatalogPaginationQuery = {
  page: number;
  limit: number;
};

export type AdminCatalogSearchQuery = CatalogPaginationQuery & {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: FoodType;
  productType?: ProductType;
  approvalStatus?: ProductApprovalStatus;
  status?: ProductStatus;
  isVisible?: boolean;
  isFeatured?: boolean;
  sortBy?: CatalogSortOption;
  sortOrder?: 'asc' | 'desc';
};

export type VendorCatalogSearchQuery = CatalogPaginationQuery & {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: FoodType;
  productType?: ProductType;
  status?: ProductStatus;
  isVisible?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortBy?: CatalogSortOption;
  sortOrder?: 'asc' | 'desc';
};

export type CustomerCatalogListQuery = CatalogPaginationQuery & {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: FoodType;
  isFeatured?: boolean;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  cityId?: string;
  storeId?: string;
  sortBy?: CatalogSortOption;
  sortOrder?: 'asc' | 'desc';
};

export type CustomerCatalogSearchQuery = Omit<CustomerCatalogListQuery, 'search'> & {
  q: string;
};

export type CustomerCategoryBrowseQuery = CatalogPaginationQuery & {
  search?: string;
  parentCategoryId?: string;
  isFeatured?: boolean;
};

export type CustomerBrandBrowseQuery = CatalogPaginationQuery & {
  search?: string;
  isFeatured?: boolean;
};

export type CustomerProductDetailQuery = {
  cityId?: string;
  storeId?: string;
};

export type CatalogFacetQuery = {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: FoodType;
  status?: ProductStatus;
  isAvailable?: boolean;
  cityId?: string;
  storeId?: string;
};

export type TenantScope = {
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
};

export type CustomerScope = {
  cityId?: string | null;
  storeId?: string | null;
};

export type CatalogFacetBucket = {
  id: string;
  name: string;
  count: number;
};

export type CatalogFacetResult = {
  categories: CatalogFacetBucket[];
  brands: CatalogFacetBucket[];
  foodTypes: Array<{ value: string; count: number }>;
  availability: Array<{ value: string; count: number }>;
};

export type AdminCatalogSearchItem = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId: string | null;
  brandId: string | null;
  categoryName: string | null;
  brandName: string | null;
  productType: string;
  foodType: string | null;
  approvalStatus: string;
  status: string;
  isVisible: boolean;
  isFeatured: boolean;
  defaultImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorCatalogSearchItem = {
  id: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  name: string;
  sku: string;
  storeSku: string | null;
  categoryId: string;
  brandId: string | null;
  mrp: number;
  sellingPrice: number;
  finalPrice: number;
  isAvailable: boolean;
  isVisible: boolean;
  status: string;
};

export type CustomerCatalogSearchItem = {
  id: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  name: string;
  shortDescription: string | null;
  categoryId: string;
  brandId: string | null;
  categoryName: string | null;
  brandName: string | null;
  defaultImageUrl: string | null;
  foodType: string | null;
  mrp: number;
  sellingPrice: number;
  finalPrice: number;
  discountType: string;
  discountValue: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  availableQuantity: number;
  isLowStock: boolean;
};

export type PaginatedCatalogResult<T> = {
  items: T[];
  total: number;
};
