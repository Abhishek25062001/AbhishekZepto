import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { BaseUnit } from '../constants/base-unit.constant';
import type { ProductUnitStatus } from '../constants/product-unit-status.constant';
import {
  createProductUnit,
  deleteProductUnit,
  getProductUnitById,
  listProductUnits,
  updateProductUnit,
} from '../services/product-unit.service';
import type { ProductUnitListQuery } from '../types/product-unit.types';

const parseProductUnitListQuery = (query: Record<string, unknown>): ProductUnitListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  status:
    typeof query.status === 'string' ? (query.status as ProductUnitStatus) : undefined,
  baseUnit: typeof query.baseUnit === 'string' ? (query.baseUnit as BaseUnit) : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string'
      ? (query.sortBy as ProductUnitListQuery['sortBy'])
      : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as ProductUnitListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listProductUnitsController = asyncHandler(async (req, res) => {
  const query = parseProductUnitListQuery(req.query as Record<string, unknown>);
  const response = await listProductUnits(query);

  return sendPaginatedResponse({
    res,
    message: 'Product units fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const createProductUnitController = asyncHandler(async (req, res) => {
  const response = await createProductUnit(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Product unit created successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const getProductUnitByIdController = asyncHandler(async (req, res) => {
  const response = await getProductUnitById(requireStringParam(req.params.unitId));

  return sendSuccessResponse({
    res,
    message: 'Product unit fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateProductUnitController = asyncHandler(async (req, res) => {
  const response = await updateProductUnit(
    requireStringParam(req.params.unitId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product unit updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const deleteProductUnitController = asyncHandler(async (req, res) => {
  const response = await deleteProductUnit(
    requireStringParam(req.params.unitId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Product unit deleted successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
