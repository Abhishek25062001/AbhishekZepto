import { sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { FoodType } from '../../products/constants/food-type.constant';
import type { CatalogSortOption } from '../constants/catalog-sort.constant';
import {
  getCustomerCatalogFacetsService,
  getCustomerFeaturedProductsService,
  getCustomerProductDetailService,
  listCustomerBrandsService,
  listCustomerCategoriesService,
  listCustomerProductVariantsService,
  searchCustomerCatalogService,
  searchCustomerProductsService,
} from '../services/catalog-search.service';
import type {
  CatalogFacetQuery,
  CustomerBrandBrowseQuery,
  CustomerCatalogListQuery,
  CustomerCatalogSearchQuery,
  CustomerCategoryBrowseQuery,
  CustomerProductDetailQuery,
} from '../types/catalog-search.types';

const parseCustomerListQuery = (query: Record<string, unknown>): CustomerCatalogListQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 20),
  search: typeof query.search === 'string' ? query.search : undefined,
  categoryId: typeof query.categoryId === 'string' ? query.categoryId : undefined,
  subcategoryId: typeof query.subcategoryId === 'string' ? query.subcategoryId : undefined,
  brandId: typeof query.brandId === 'string' ? query.brandId : undefined,
  foodType: typeof query.foodType === 'string' ? (query.foodType as FoodType) : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  isAvailable: typeof query.isAvailable === 'boolean' ? query.isAvailable : undefined,
  minPrice: query.minPrice !== undefined ? Number(query.minPrice) : undefined,
  maxPrice: query.maxPrice !== undefined ? Number(query.maxPrice) : undefined,
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
  sortBy: typeof query.sortBy === 'string' ? (query.sortBy as CatalogSortOption) : undefined,
  sortOrder: typeof query.sortOrder === 'string' ? (query.sortOrder as 'asc' | 'desc') : undefined,
});

const actorFromRequest = (req: { user?: { userId?: string; role?: string | null; cityId?: string | null } }) => ({
  userId: req.user?.userId,
  role: req.user?.role ?? null,
  cityId: req.user?.cityId ?? null,
});

const parseCustomerCategoryBrowseQuery = (
  query: Record<string, unknown>,
): CustomerCategoryBrowseQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 50),
  search: typeof query.search === 'string' ? query.search : undefined,
  parentCategoryId:
    typeof query.parentCategoryId === 'string' ? query.parentCategoryId : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
});

const parseCustomerBrandBrowseQuery = (query: Record<string, unknown>): CustomerBrandBrowseQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 50),
  search: typeof query.search === 'string' ? query.search : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
});

export const listCustomerCategoriesController = asyncHandler(async (req, res) => {
  const query = parseCustomerCategoryBrowseQuery(req.query as Record<string, unknown>);
  const response = await listCustomerCategoriesService(query);

  return sendPaginatedResponse({
    res,
    message: 'Categories fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listCustomerBrandsController = asyncHandler(async (req, res) => {
  const query = parseCustomerBrandBrowseQuery(req.query as Record<string, unknown>);
  const response = await listCustomerBrandsService(query);

  return sendPaginatedResponse({
    res,
    message: 'Brands fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

const parseCustomerProductDetailQuery = (
  query: Record<string, unknown>,
): CustomerProductDetailQuery => ({
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
});

export const getCustomerProductDetailController = asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const query = parseCustomerProductDetailQuery(req.query as Record<string, unknown>);
  const data = await getCustomerProductDetailService(productId, actorFromRequest(req), query);

  return sendSuccessResponse({
    res,
    message: 'Product fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listCustomerProductVariantsController = asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const data = await listCustomerProductVariantsService(productId);

  return sendSuccessResponse({
    res,
    message: 'Product variants fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listCustomerCatalogProductsController = asyncHandler(async (req, res) => {
  const query = parseCustomerListQuery(req.query as Record<string, unknown>);
  const response = await searchCustomerProductsService(query, actorFromRequest(req));

  return sendPaginatedResponse({
    res,
    message: 'Customer catalog products fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const searchCustomerCatalogController = asyncHandler(async (req, res) => {
  const base = parseCustomerListQuery(req.query as Record<string, unknown>);
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const query: CustomerCatalogSearchQuery = { ...base, q };
  const response = await searchCustomerCatalogService(query, actorFromRequest(req));

  return sendPaginatedResponse({
    res,
    message: 'Customer catalog search completed successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCustomerFeaturedProductsController = asyncHandler(async (req, res) => {
  const query = parseCustomerListQuery(req.query as Record<string, unknown>);
  const response = await getCustomerFeaturedProductsService(query, actorFromRequest(req));

  return sendPaginatedResponse({
    res,
    message: 'Featured products fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCustomerCatalogFacetsController = asyncHandler(async (req, res) => {
  const query: CatalogFacetQuery = {
    search: typeof req.query.search === 'string' ? req.query.search : undefined,
    categoryId: typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined,
    subcategoryId: typeof req.query.subcategoryId === 'string' ? req.query.subcategoryId : undefined,
    brandId: typeof req.query.brandId === 'string' ? req.query.brandId : undefined,
    foodType: typeof req.query.foodType === 'string' ? (req.query.foodType as FoodType) : undefined,
    cityId: typeof req.query.cityId === 'string' ? req.query.cityId : undefined,
    storeId: typeof req.query.storeId === 'string' ? req.query.storeId : undefined,
  };
  const data = await getCustomerCatalogFacetsService(query, actorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Customer catalog facets fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
