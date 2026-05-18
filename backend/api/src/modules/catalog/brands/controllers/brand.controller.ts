import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import {
  createBrand,
  deleteBrand,
  getBrandById,
  listBrands,
  updateBrand,
} from '../services/brand.service';
import type { BrandListQuery, BrandStatus } from '../types/brand.types';

const parseBrandListQuery = (query: Record<string, unknown>): BrandListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  status: typeof query.status === 'string' ? (query.status as BrandStatus) : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as BrandListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as BrandListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listBrandsController = asyncHandler(async (req, res) => {
  const query = parseBrandListQuery(req.query as Record<string, unknown>);
  const response = await listBrands(query);

  return sendPaginatedResponse({
    res,
    message: 'Brands fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const createBrandController = asyncHandler(async (req, res) => {
  const response = await createBrand(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Brand created successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const getBrandByIdController = asyncHandler(async (req, res) => {
  const response = await getBrandById(requireStringParam(req.params.brandId));

  return sendSuccessResponse({
    res,
    message: 'Brand fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateBrandController = asyncHandler(async (req, res) => {
  const response = await updateBrand(
    requireStringParam(req.params.brandId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Brand updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const deleteBrandController = asyncHandler(async (req, res) => {
  const response = await deleteBrand(
    requireStringParam(req.params.brandId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Brand deleted successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
