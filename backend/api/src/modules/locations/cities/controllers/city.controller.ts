import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { CityStatus } from '../constants/city-status.constant';
import {
  createCity,
  deleteCity,
  getCityById,
  listCities,
  updateCity,
} from '../services/city.service';
import type { CityListQuery } from '../types/city.types';

const parseCityListQuery = (query: Record<string, unknown>): CityListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  status: typeof query.status === 'string' ? (query.status as CityStatus) : undefined,
  isServiceable: typeof query.isServiceable === 'boolean' ? query.isServiceable : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as CityListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as CityListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listCitiesController = asyncHandler(async (req, res) => {
  const query = parseCityListQuery(req.query as Record<string, unknown>);
  const response = await listCities(query);

  return sendPaginatedResponse({
    res,
    message: 'Cities fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const createCityController = asyncHandler(async (req, res) => {
  const response = await createCity(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'City created successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCityByIdController = asyncHandler(async (req, res) => {
  const response = await getCityById(requireStringParam(req.params.cityId));

  return sendSuccessResponse({
    res,
    message: 'City fetched successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateCityController = asyncHandler(async (req, res) => {
  const response = await updateCity(
    requireStringParam(req.params.cityId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'City updated successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const deleteCityController = asyncHandler(async (req, res) => {
  const response = await deleteCity(
    requireStringParam(req.params.cityId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'City deleted successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
