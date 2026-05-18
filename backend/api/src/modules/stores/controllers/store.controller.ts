import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { FulfillmentType } from '../constants/fulfillment-type.constant';
import type { StoreStatus } from '../constants/store-status.constant';
import type { StoreType } from '../constants/store-type.constant';
import {
  createStore,
  deleteStore,
  getStoreById,
  listStores,
  updateStore,
} from '../services/store.service';
import type { StoreListQuery } from '../types/store.types';

const parseStoreListQuery = (query: Record<string, unknown>): StoreListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  vendorId: typeof query.vendorId === 'string' ? query.vendorId : undefined,
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  serviceAreaId: typeof query.serviceAreaId === 'string' ? query.serviceAreaId : undefined,
  status: typeof query.status === 'string' ? (query.status as StoreStatus) : undefined,
  isOpen: typeof query.isOpen === 'boolean' ? query.isOpen : undefined,
  isAcceptingOrders:
    typeof query.isAcceptingOrders === 'boolean' ? query.isAcceptingOrders : undefined,
  storeType: typeof query.storeType === 'string' ? (query.storeType as StoreType) : undefined,
  fulfillmentType:
    typeof query.fulfillmentType === 'string'
      ? (query.fulfillmentType as FulfillmentType)
      : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as StoreListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as StoreListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

const requireActorUserId = (userId?: string): string => userId ?? '';

export const listStoresController = asyncHandler(async (req, res) => {
  const query = parseStoreListQuery(req.query as Record<string, unknown>);
  const response = await listStores(query);

  return sendPaginatedResponse({
    res,
    message: 'Stores fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const createStoreController = asyncHandler(async (req, res) => {
  const response = await createStore(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Store created successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getStoreByIdController = asyncHandler(async (req, res) => {
  const response = await getStoreById(requireStringParam(req.params.storeId));

  return sendSuccessResponse({
    res,
    message: 'Store fetched successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateStoreController = asyncHandler(async (req, res) => {
  const response = await updateStore(
    requireStringParam(req.params.storeId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Store updated successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const deleteStoreController = asyncHandler(async (req, res) => {
  const response = await deleteStore(
    requireStringParam(req.params.storeId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Store deleted successfully',
    data: response,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
