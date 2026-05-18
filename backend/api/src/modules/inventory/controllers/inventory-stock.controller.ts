import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { InventoryStockListQuery } from '../types/inventory-stock.types';
import {
  adjustInventoryStockAdmin,
  bulkUpdateInventoryThresholds,
  bulkUploadInventoryStocks,
  createInventoryStock,
  deleteInventoryStock,
  getInventoryStockById,
  listInventoryStocks,
  updateInventoryStockSettings,
} from '../services/inventory-stock.service';

const parseListQuery = (query: Record<string, unknown>): InventoryStockListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
  vendorId: typeof query.vendorId === 'string' ? query.vendorId : undefined,
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  storeProductId: typeof query.storeProductId === 'string' ? query.storeProductId : undefined,
  productId: typeof query.productId === 'string' ? query.productId : undefined,
  variantId: typeof query.variantId === 'string' ? query.variantId : undefined,
  sku: typeof query.sku === 'string' ? query.sku : undefined,
  isLowStock: typeof query.isLowStock === 'boolean' ? query.isLowStock : undefined,
  isOutOfStock: typeof query.isOutOfStock === 'boolean' ? query.isOutOfStock : undefined,
  status: typeof query.status === 'string' ? (query.status as InventoryStockListQuery['status']) : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as InventoryStockListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as InventoryStockListQuery['sortOrder'])
      : undefined,
});

const requireActorUserId = (userId?: string): string => userId ?? '';
const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

export const createInventoryStockController = asyncHandler(async (req, res) => {
  const created = await createInventoryStock(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Inventory stock created successfully',
    data: created,
  });
});

export const listInventoryStocksController = asyncHandler(async (req, res) => {
  const query = parseListQuery(req.query as Record<string, unknown>);
  const response = await listInventoryStocks(query);

  return sendPaginatedResponse({
    res,
    message: 'Inventory stocks fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const getInventoryStockByIdController = asyncHandler(async (req, res) => {
  const stock = await getInventoryStockById(requireStringParam(req.params.inventoryStockId));

  return sendSuccessResponse({
    res,
    message: 'Inventory stock fetched successfully',
    data: stock,
  });
});

export const updateInventoryStockController = asyncHandler(async (req, res) => {
  const updated = await updateInventoryStockSettings(
    requireStringParam(req.params.inventoryStockId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Inventory stock updated successfully',
    data: updated,
  });
});

export const deleteInventoryStockController = asyncHandler(async (req, res) => {
  const deleted = await deleteInventoryStock(
    requireStringParam(req.params.inventoryStockId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Inventory stock deleted successfully',
    data: deleted,
  });
});

export const adjustInventoryStockController = asyncHandler(async (req, res) => {
  const updated = await adjustInventoryStockAdmin(
    requireStringParam(req.params.inventoryStockId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Inventory stock adjusted successfully',
    data: updated,
  });
});

export const bulkUploadInventoryStocksController = asyncHandler(async (req, res) => {
  const result = await bulkUploadInventoryStocks(req.body, requireActorUserId(req.user?.userId));

  return sendSuccessResponse({
    res,
    message: 'Inventory bulk upload completed',
    data: result,
  });
});

export const bulkUpdateInventoryThresholdsController = asyncHandler(async (req, res) => {
  const result = await bulkUpdateInventoryThresholds(req.body, requireActorUserId(req.user?.userId));

  return sendSuccessResponse({
    res,
    message: 'Inventory thresholds updated successfully',
    data: result,
  });
});
