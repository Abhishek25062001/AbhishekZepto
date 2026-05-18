import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { FoodType } from '../constants/food-type.constant';
import type { ProductApprovalStatus } from '../constants/product-approval-status.constant';
import type { ProductStatus } from '../constants/product-status.constant';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
  updateProductApprovalStatus,
} from '../services/product.service';
import type { ProductListQuery } from '../types/product.types';

const parseProductListQuery = (query: Record<string, unknown>): ProductListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  categoryId: typeof query.categoryId === 'string' ? query.categoryId : undefined,
  subcategoryId: typeof query.subcategoryId === 'string' ? query.subcategoryId : undefined,
  brandId: typeof query.brandId === 'string' ? query.brandId : undefined,
  approvalStatus:
    typeof query.approvalStatus === 'string'
      ? (query.approvalStatus as ProductApprovalStatus)
      : undefined,
  status: typeof query.status === 'string' ? (query.status as ProductStatus) : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  foodType: typeof query.foodType === 'string' ? (query.foodType as FoodType) : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string'
      ? (query.sortBy as ProductListQuery['sortBy'])
      : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as ProductListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listProductsController = asyncHandler(async (req, res) => {
  const query = parseProductListQuery(req.query as Record<string, unknown>);
  const response = await listProducts(query);

  return sendPaginatedResponse({
    res,
    message: 'Products fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const createProductController = asyncHandler(async (req, res) => {
  const response = await createProduct(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Product created successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const getProductByIdController = asyncHandler(async (req, res) => {
  const response = await getProductById(requireStringParam(req.params.productId));

  return sendSuccessResponse({
    res,
    message: 'Product fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateProductController = asyncHandler(async (req, res) => {
  const response = await updateProduct(
    requireStringParam(req.params.productId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateProductApprovalStatusController = asyncHandler(async (req, res) => {
  const response = await updateProductApprovalStatus(
    requireStringParam(req.params.productId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product approval status updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const response = await deleteProduct(
    requireStringParam(req.params.productId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product deleted successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
