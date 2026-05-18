import { Types, type FilterQuery } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { CATALOG_SEARCH_ERROR_CODES } from '../constants/catalog-search-error-codes.constant';
import type { ProductRecord } from '../../products/models/product.model';
import type { StoreProductRecord } from '../../../store-products/models/store-product.model';
import type {
  AdminCatalogSearchQuery,
  CustomerCatalogListQuery,
  CustomerScope,
  TenantScope,
  VendorCatalogSearchQuery,
} from '../types/catalog-search.types';
import { buildProductTextSearchFilter, buildSearchRegex } from './catalog-search-query.util';

const toObjectId = (value?: string): Types.ObjectId | undefined => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return undefined;
  }

  return new Types.ObjectId(value);
};

export const assertValidPriceRange = (minPrice?: number, maxPrice?: number): void => {
  if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
    throw new AppError({
      message: 'maxPrice must be greater than or equal to minPrice',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES[CATALOG_SEARCH_ERROR_CODES.CATALOG_SEARCH_PRICE_RANGE_INVALID],
    });
  }
};

export const buildAdminProductFilters = (
  query: AdminCatalogSearchQuery,
): FilterQuery<ProductRecord> => {
  const filter: FilterQuery<ProductRecord> = { isDeleted: false };

  const categoryId = toObjectId(query.categoryId);
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  const subcategoryId = toObjectId(query.subcategoryId);
  if (subcategoryId) {
    filter.subcategoryId = subcategoryId;
  }

  const brandId = toObjectId(query.brandId);
  if (brandId) {
    filter.brandId = brandId;
  }

  if (query.approvalStatus) {
    filter.approvalStatus = query.approvalStatus;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isVisible === 'boolean') {
    filter.isVisible = query.isVisible;
  }

  if (typeof query.isFeatured === 'boolean') {
    filter.isFeatured = query.isFeatured;
  }

  if (query.foodType) {
    filter.foodType = query.foodType;
  }

  if (query.productType) {
    filter.productType = query.productType;
  }

  Object.assign(filter, buildProductTextSearchFilter(query.search));

  return filter;
};

export const buildStoreProductBaseMatch = (
  query: VendorCatalogSearchQuery | CustomerCatalogListQuery,
  scope: TenantScope | CustomerScope,
): FilterQuery<StoreProductRecord> => {
  const match: FilterQuery<StoreProductRecord> = {
    isDeleted: false,
    status: 'active',
    isVisible: true,
  };

  const vendorId = toObjectId('vendorId' in scope ? scope.vendorId ?? undefined : undefined);
  if (vendorId) {
    match.vendorId = vendorId;
  }

  const storeId = toObjectId(scope.storeId ?? undefined);
  if (storeId) {
    match.storeId = storeId;
  }

  const cityId = toObjectId(scope.cityId ?? undefined);
  if (cityId) {
    match.cityId = cityId;
  }

  const categoryId = toObjectId(query.categoryId);
  if (categoryId) {
    match.categoryId = categoryId;
  }

  const brandId = toObjectId(query.brandId);
  if (brandId) {
    match.brandId = brandId;
  }

  if (typeof query.isFeatured === 'boolean') {
    match.isFeatured = query.isFeatured;
  }

  if ('isAvailable' in query && typeof query.isAvailable === 'boolean') {
    match.isAvailable = query.isAvailable;
  }

  if ('minPrice' in query || 'maxPrice' in query) {
    assertValidPriceRange(query.minPrice, query.maxPrice);
    match.finalPrice = {};
    if (query.minPrice !== undefined) {
      match.finalPrice.$gte = query.minPrice;
    }
    if (query.maxPrice !== undefined) {
      match.finalPrice.$lte = query.maxPrice;
    }
  }

  if (query.search?.trim()) {
    const regex = buildSearchRegex(query.search.trim());
    match.$or = [{ sku: regex }, { storeSku: regex }];
  }

  return match;
};

export const buildVendorProductFilters = (
  query: VendorCatalogSearchQuery,
  tenantScope: TenantScope,
): { storeProductMatch: FilterQuery<StoreProductRecord>; productMatch: FilterQuery<ProductRecord> } => {
  const storeProductMatch = buildStoreProductBaseMatch(query, tenantScope);

  const productMatch: FilterQuery<ProductRecord> = { isDeleted: false };

  if (query.foodType) {
    productMatch.foodType = query.foodType;
  }

  if (query.productType) {
    productMatch.productType = query.productType;
  }

  if (query.status) {
    productMatch.status = query.status;
  }

  if (typeof query.isVisible === 'boolean') {
    productMatch.isVisible = query.isVisible;
  }

  const subcategoryId = toObjectId(query.subcategoryId);
  if (subcategoryId) {
    productMatch.subcategoryId = subcategoryId;
  }

  Object.assign(productMatch, buildProductTextSearchFilter(query.search));

  return { storeProductMatch, productMatch };
};

export const customerCatalogProductVisibilityFilter = (): FilterQuery<ProductRecord> => ({
  isDeleted: false,
  status: 'active',
  approvalStatus: 'approved',
  isVisible: true,
});

export const customerCatalogVariantVisibilityFilter = () => ({
  isDeleted: false,
  status: 'active' as const,
  isVisible: true,
});

export const buildCustomerProductFilters = (
  query: CustomerCatalogListQuery,
  customerScope: CustomerScope,
): {
  storeProductMatch: FilterQuery<StoreProductRecord>;
  productMatch: FilterQuery<ProductRecord>;
  requireInStock: boolean;
} => {
  assertValidPriceRange(query.minPrice, query.maxPrice);

  const storeProductMatch = buildStoreProductBaseMatch(query, customerScope);
  storeProductMatch.isAvailable = true;

  const productMatch: FilterQuery<ProductRecord> = customerCatalogProductVisibilityFilter();

  if (query.foodType) {
    productMatch.foodType = query.foodType;
  }

  const subcategoryId = toObjectId(query.subcategoryId);
  if (subcategoryId) {
    productMatch.subcategoryId = subcategoryId;
  }

  if (query.isFeatured === true) {
    productMatch.isFeatured = true;
  }

  Object.assign(productMatch, buildProductTextSearchFilter(query.search));

  return {
    storeProductMatch,
    productMatch,
    requireInStock: query.isAvailable === true,
  };
};
