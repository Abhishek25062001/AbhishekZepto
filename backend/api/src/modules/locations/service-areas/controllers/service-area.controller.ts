import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { ServiceAreaStatus } from '../constants/service-area-status.constant';
import {
  createServiceArea,
  deleteServiceArea,
  getServiceAreaById,
  listServiceAreas,
  updateServiceArea,
} from '../services/service-area.service';
import type { ServiceAreaListQuery } from '../types/service-area.types';

const parseServiceAreaListQuery = (query: Record<string, unknown>): ServiceAreaListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  status:
    typeof query.status === 'string' ? (query.status as ServiceAreaStatus) : undefined,
  isServiceable: typeof query.isServiceable === 'boolean' ? query.isServiceable : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string'
      ? (query.sortBy as ServiceAreaListQuery['sortBy'])
      : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as ServiceAreaListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listServiceAreasController = asyncHandler(async (req, res) => {
  const query = parseServiceAreaListQuery(req.query as Record<string, unknown>);
  const response = await listServiceAreas(query);

  return sendPaginatedResponse({
    res,
    message: 'Service areas fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const createServiceAreaController = asyncHandler(async (req, res) => {
  const response = await createServiceArea(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Service area created successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getServiceAreaByIdController = asyncHandler(async (req, res) => {
  const response = await getServiceAreaById(requireStringParam(req.params.serviceAreaId));

  return sendSuccessResponse({
    res,
    message: 'Service area fetched successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateServiceAreaController = asyncHandler(async (req, res) => {
  const response = await updateServiceArea(
    requireStringParam(req.params.serviceAreaId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Service area updated successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const deleteServiceAreaController = asyncHandler(async (req, res) => {
  const response = await deleteServiceArea(
    requireStringParam(req.params.serviceAreaId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Service area deleted successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
