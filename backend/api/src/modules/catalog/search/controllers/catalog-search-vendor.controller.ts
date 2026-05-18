import { sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { FoodType } from '../../products/constants/food-type.constant';
import type { ProductStatus } from '../../products/constants/product-status.constant';
import type { ProductType } from '../../products/constants/product-type.constant';
import type { CatalogSortOption } from '../constants/catalog-sort.constant';
import {
  getVendorCatalogFacetsService,
  getVendorProductDetailService,
  listVendorBrandsService,
  listVendorCategoriesService,
  listVendorProductVariantsService,
  searchVendorProductsService,
} from '../services/catalog-search.service';
import type {
  CatalogFacetQuery,
  CustomerBrandBrowseQuery,
  CustomerCategoryBrowseQuery,
  VendorCatalogSearchQuery,
} from '../types/catalog-search.types';

const parseVendorQuery = (query: Record<string, unknown>): VendorCatalogSearchQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 20),
  search: typeof query.search === 'string' ? query.search : undefined,
  categoryId: typeof query.categoryId === 'string' ? query.categoryId : undefined,
  subcategoryId: typeof query.subcategoryId === 'string' ? query.subcategoryId : undefined,
  brandId: typeof query.brandId === 'string' ? query.brandId : undefined,
  foodType: typeof query.foodType === 'string' ? (query.foodType as FoodType) : undefined,
  productType: typeof query.productType === 'string' ? (query.productType as ProductType) : undefined,
  status: typeof query.status === 'string' ? (query.status as ProductStatus) : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isAvailable: typeof query.isAvailable === 'boolean' ? query.isAvailable : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  sortBy: typeof query.sortBy === 'string' ? (query.sortBy as CatalogSortOption) : undefined,
  sortOrder: typeof query.sortOrder === 'string' ? (query.sortOrder as 'asc' | 'desc') : undefined,
});

const parseFacetQuery = (query: Record<string, unknown>): CatalogFacetQuery => ({
  search: typeof query.search === 'string' ? query.search : undefined,
  categoryId: typeof query.categoryId === 'string' ? query.categoryId : undefined,
  subcategoryId: typeof query.subcategoryId === 'string' ? query.subcategoryId : undefined,
  brandId: typeof query.brandId === 'string' ? query.brandId : undefined,
  foodType: typeof query.foodType === 'string' ? (query.foodType as FoodType) : undefined,
  status: typeof query.status === 'string' ? (query.status as ProductStatus) : undefined,
  isAvailable: typeof query.isAvailable === 'boolean' ? query.isAvailable : undefined,
});

const parseVendorCategoryBrowseQuery = (
  query: Record<string, unknown>,
): CustomerCategoryBrowseQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 50),
  search: typeof query.search === 'string' ? query.search : undefined,
  parentCategoryId:
    typeof query.parentCategoryId === 'string' ? query.parentCategoryId : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
});

const parseVendorBrandBrowseQuery = (query: Record<string, unknown>): CustomerBrandBrowseQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 50),
  search: typeof query.search === 'string' ? query.search : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
});

const vendorActorFromRequest = (req: {
  user?: {
    userId?: string;
    role?: string | null;
    vendorId?: string | null;
    storeId?: string | null;
    cityId?: string | null;
  };
}) => ({
  userId: req.user?.userId,
  role: req.user?.role ?? null,
  vendorId: req.user?.vendorId ?? null,
  storeId: req.user?.storeId ?? null,
  cityId: req.user?.cityId ?? null,
});

export const listVendorCategoriesController = asyncHandler(async (req, res) => {
  const query = parseVendorCategoryBrowseQuery(req.query as Record<string, unknown>);
  const response = await listVendorCategoriesService(query);

  return sendPaginatedResponse({
    res,
    message: 'Vendor catalog categories fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listVendorBrandsController = asyncHandler(async (req, res) => {
  const query = parseVendorBrandBrowseQuery(req.query as Record<string, unknown>);
  const response = await listVendorBrandsService(query);

  return sendPaginatedResponse({
    res,
    message: 'Vendor catalog brands fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getVendorProductDetailController = asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const data = await getVendorProductDetailService(productId, vendorActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Vendor catalog product fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listVendorProductVariantsController = asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const data = await listVendorProductVariantsService(productId);

  return sendSuccessResponse({
    res,
    message: 'Vendor catalog product variants fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listVendorCatalogProductsController = asyncHandler(async (req, res) => {
  const query = parseVendorQuery(req.query as Record<string, unknown>);
  const response = await searchVendorProductsService(query, {
    userId: req.user?.userId,
    role: req.user?.role ?? null,
    vendorId: req.user?.vendorId ?? null,
    storeId: req.user?.storeId ?? null,
    cityId: req.user?.cityId ?? null,
  });

  return sendPaginatedResponse({
    res,
    message: 'Vendor catalog products fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getVendorCatalogFacetsController = asyncHandler(async (req, res) => {
  const query = parseFacetQuery(req.query as Record<string, unknown>);
  const data = await getVendorCatalogFacetsService(query, {
    userId: req.user?.userId,
    role: req.user?.role ?? null,
    vendorId: req.user?.vendorId ?? null,
    storeId: req.user?.storeId ?? null,
    cityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Vendor catalog facets fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
