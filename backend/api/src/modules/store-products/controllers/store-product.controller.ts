import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { StoreProductStatus } from '../constants/store-product-status.constant';
import type { StoreProductBulkDuplicateMode } from '../constants/store-product-bulk-duplicate-mode.constant';
import {
  bulkMapStoreProducts,
  bulkUpdateStoreProductPrices,
  bulkUpdateStoreProductVisibility,
  createStoreProduct,
  deleteStoreProduct,
  getStoreProductById,
  listStoreProducts,
  updateStoreProduct,
} from '../services/store-product.service';
import type { StoreProductListQuery } from '../types/store-product.types';

const parseStoreProductListQuery = (query: Record<string, unknown>): StoreProductListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
  vendorId: typeof query.vendorId === 'string' ? query.vendorId : undefined,
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  productId: typeof query.productId === 'string' ? query.productId : undefined,
  variantId: typeof query.variantId === 'string' ? query.variantId : undefined,
  categoryId: typeof query.categoryId === 'string' ? query.categoryId : undefined,
  brandId: typeof query.brandId === 'string' ? query.brandId : undefined,
  status: typeof query.status === 'string' ? (query.status as StoreProductStatus) : undefined,
  isAvailable: typeof query.isAvailable === 'boolean' ? query.isAvailable : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as StoreProductListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as StoreProductListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listStoreProductsController = asyncHandler(async (req, res) => {
  const query = parseStoreProductListQuery(req.query as Record<string, unknown>);
  const response = await listStoreProducts(query);

  return sendPaginatedResponse({
    res,
    message: 'Store products fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const createStoreProductController = asyncHandler(async (req, res) => {
  const created = await createStoreProduct(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Store product mapping created successfully',
    data: created,
  });
});

export const getStoreProductByIdController = asyncHandler(async (req, res) => {
  const storeProduct = await getStoreProductById(requireStringParam(req.params.storeProductId));

  return sendSuccessResponse({
    res,
    message: 'Store product mapping fetched successfully',
    data: storeProduct,
  });
});

export const updateStoreProductController = asyncHandler(async (req, res) => {
  const updated = await updateStoreProduct(
    requireStringParam(req.params.storeProductId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Store product mapping updated successfully',
    data: updated,
  });
});

export const deleteStoreProductController = asyncHandler(async (req, res) => {
  const deleted = await deleteStoreProduct(
    requireStringParam(req.params.storeProductId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Store product mapping deleted successfully',
    data: deleted,
  });
});

export const bulkMapStoreProductsController = asyncHandler(async (req, res) => {
  const result = await bulkMapStoreProducts(
    {
      storeId: req.body.storeId,
      items: req.body.items,
      duplicateMode: req.body.duplicateMode as StoreProductBulkDuplicateMode | undefined,
    },
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Store products bulk mapped successfully',
    data: result,
  });
});

export const bulkUpdateStoreProductPricesController = asyncHandler(async (req, res) => {
  const result = await bulkUpdateStoreProductPrices(req.body, requireActorUserId(req.user?.userId));

  return sendSuccessResponse({
    res,
    message: 'Store product prices bulk updated successfully',
    data: result,
  });
});

export const bulkUpdateStoreProductVisibilityController = asyncHandler(async (req, res) => {
  const result = await bulkUpdateStoreProductVisibility(
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Store product visibility bulk updated successfully',
    data: result,
  });
});
