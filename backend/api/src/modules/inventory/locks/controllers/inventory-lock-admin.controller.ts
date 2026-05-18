import { sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { InventoryLockListQuery } from '../types/inventory-lock.types';
import {
  expireDueInventoryLocks,
  getInventoryLockById,
  listInventoryLocks,
} from '../services/inventory-lock.service';

const parseListQuery = (query: Record<string, unknown>): InventoryLockListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
  vendorId: typeof query.vendorId === 'string' ? query.vendorId : undefined,
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  inventoryStockId: typeof query.inventoryStockId === 'string' ? query.inventoryStockId : undefined,
  storeProductId: typeof query.storeProductId === 'string' ? query.storeProductId : undefined,
  customerId: typeof query.customerId === 'string' ? query.customerId : undefined,
  cartId: typeof query.cartId === 'string' ? query.cartId : undefined,
  orderId: typeof query.orderId === 'string' ? query.orderId : undefined,
  lockType:
    typeof query.lockType === 'string' ? (query.lockType as InventoryLockListQuery['lockType']) : undefined,
  status:
    typeof query.status === 'string' ? (query.status as InventoryLockListQuery['status']) : undefined,
  expiresBefore: typeof query.expiresBefore === 'string' ? query.expiresBefore : undefined,
  expiresAfter: typeof query.expiresAfter === 'string' ? query.expiresAfter : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as InventoryLockListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as InventoryLockListQuery['sortOrder'])
      : undefined,
});

const requireActorUserId = (userId?: string): string => userId ?? 'system';
const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

export const listInventoryLocksController = asyncHandler(async (req, res) => {
  const query = parseListQuery(req.query as Record<string, unknown>);
  const response = await listInventoryLocks(query);

  return sendPaginatedResponse({
    res,
    message: 'Inventory locks fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const getInventoryLockByIdController = asyncHandler(async (req, res) => {
  const lock = await getInventoryLockById(requireStringParam(req.params.lockId));

  return sendSuccessResponse({
    res,
    message: 'Inventory lock fetched successfully',
    data: lock,
  });
});

export const expireDueInventoryLocksController = asyncHandler(async (req, res) => {
  const summary = await expireDueInventoryLocks(requireActorUserId(req.user?.userId));

  return sendSuccessResponse({
    res,
    message: 'Expired due inventory locks processed',
    data: summary,
  });
});
