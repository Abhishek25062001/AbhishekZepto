import { sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { StoreProductStatus } from '../constants/store-product-status.constant';
import {
  getVendorStoreProductById,
  listVendorStoreProducts,
  updateVendorStoreProductAvailability,
  updateVendorStoreProductPrice,
} from '../services/store-product-vendor.service';
import type { StoreProductListQuery } from '../types/store-product.types';

const parseStoreProductListQuery = (query: Record<string, unknown>): StoreProductListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
  productId: typeof query.productId === 'string' ? query.productId : undefined,
  variantId: typeof query.variantId === 'string' ? query.variantId : undefined,
  status: typeof query.status === 'string' ? (query.status as StoreProductStatus) : undefined,
  isAvailable: typeof query.isAvailable === 'boolean' ? query.isAvailable : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

const requireActorUserId = (userId?: string): string => userId ?? '';

const vendorScopeFromRequest = (user?: {
  vendorId?: string | null;
  storeId?: string | null;
}) => ({
  vendorId: user?.vendorId ?? null,
  storeId: user?.storeId ?? null,
});

export const listVendorStoreProductsController = asyncHandler(async (req, res) => {
  const query = parseStoreProductListQuery(req.query as Record<string, unknown>);
  const response = await listVendorStoreProducts(query, vendorScopeFromRequest(req.user));

  return sendPaginatedResponse({
    res,
    message: 'Vendor store products fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const getVendorStoreProductByIdController = asyncHandler(async (req, res) => {
  const storeProduct = await getVendorStoreProductById(
    requireStringParam(req.params.storeProductId),
    vendorScopeFromRequest(req.user),
  );

  return sendSuccessResponse({
    res,
    message: 'Vendor store product mapping fetched successfully',
    data: storeProduct,
  });
});

export const updateVendorStoreProductAvailabilityController = asyncHandler(async (req, res) => {
  const updated = await updateVendorStoreProductAvailability(
    requireStringParam(req.params.storeProductId),
    req.body,
    requireActorUserId(req.user?.userId),
    vendorScopeFromRequest(req.user),
  );

  return sendSuccessResponse({
    res,
    message: 'Vendor store product availability updated successfully',
    data: updated,
  });
});

export const updateVendorStoreProductPriceController = asyncHandler(async (req, res) => {
  const updated = await updateVendorStoreProductPrice(
    requireStringParam(req.params.storeProductId),
    req.body,
    requireActorUserId(req.user?.userId),
    vendorScopeFromRequest(req.user),
  );

  return sendSuccessResponse({
    res,
    message: 'Vendor store product price updated successfully',
    data: updated,
  });
});
