import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { VariantStatus } from '../constants/variant-status.constant';
import {
  createProductVariant,
  deleteProductVariant,
  listProductVariants,
  updateProductVariant,
} from '../services/product-variant.service';
import type { ProductVariantListQuery } from '../types/product-variant.types';

const parseVariantListQuery = (query: Record<string, unknown>): ProductVariantListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  status: typeof query.status === 'string' ? (query.status as VariantStatus) : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isDefault: typeof query.isDefault === 'boolean' ? query.isDefault : undefined,
  sortBy:
    typeof query.sortBy === 'string'
      ? (query.sortBy as ProductVariantListQuery['sortBy'])
      : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as ProductVariantListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listProductVariantsController = asyncHandler(async (req, res) => {
  const productId = requireStringParam(req.params.productId);
  const query = parseVariantListQuery(req.query as Record<string, unknown>);
  const response = await listProductVariants(productId, query);

  return sendPaginatedResponse({
    res,
    message: 'Product variants fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const createProductVariantController = asyncHandler(async (req, res) => {
  const productId = requireStringParam(req.params.productId);
  const response = await createProductVariant(
    productId,
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendCreatedResponse({
    res,
    message: 'Product variant created successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateProductVariantController = asyncHandler(async (req, res) => {
  const productId = requireStringParam(req.params.productId);
  const variantId = requireStringParam(req.params.variantId);
  const response = await updateProductVariant(
    productId,
    variantId,
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product variant updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const deleteProductVariantController = asyncHandler(async (req, res) => {
  const productId = requireStringParam(req.params.productId);
  const variantId = requireStringParam(req.params.variantId);
  const response = await deleteProductVariant(
    productId,
    variantId,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product variant deleted successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
