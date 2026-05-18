import { sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { InventoryMovementListQuery } from '../movements/types/inventory-movement.types';
import type { InventoryStockListQuery } from '../types/inventory-stock.types';
import {
  adjustVendorInventoryStock,
  getVendorInventoryStockById,
  listVendorInventoryMovements,
  listVendorInventoryStocks,
} from '../services/inventory-vendor.service';

const parseStockListQuery = (query: Record<string, unknown>): InventoryStockListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  storeProductId: typeof query.storeProductId === 'string' ? query.storeProductId : undefined,
  productId: typeof query.productId === 'string' ? query.productId : undefined,
  variantId: typeof query.variantId === 'string' ? query.variantId : undefined,
  sku: typeof query.sku === 'string' ? query.sku : undefined,
  isLowStock: typeof query.isLowStock === 'boolean' ? query.isLowStock : undefined,
  isOutOfStock: typeof query.isOutOfStock === 'boolean' ? query.isOutOfStock : undefined,
  status: typeof query.status === 'string' ? (query.status as InventoryStockListQuery['status']) : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
});

const parseMovementListQuery = (query: Record<string, unknown>): InventoryMovementListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  inventoryStockId: typeof query.inventoryStockId === 'string' ? query.inventoryStockId : undefined,
  storeProductId: typeof query.storeProductId === 'string' ? query.storeProductId : undefined,
  productId: typeof query.productId === 'string' ? query.productId : undefined,
  variantId: typeof query.variantId === 'string' ? query.variantId : undefined,
  movementType:
    typeof query.movementType === 'string'
      ? (query.movementType as InventoryMovementListQuery['movementType'])
      : undefined,
  fromDate: typeof query.fromDate === 'string' ? query.fromDate : undefined,
  toDate: typeof query.toDate === 'string' ? query.toDate : undefined,
});

const vendorScopeFromRequest = (user?: { vendorId?: string | null; storeId?: string | null }) => ({
  vendorId: user?.vendorId ?? null,
  storeId: user?.storeId ?? null,
});

const requireActorUserId = (userId?: string): string => userId ?? '';
const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

export const listVendorInventoryStocksController = asyncHandler(async (req, res) => {
  const query = parseStockListQuery(req.query as Record<string, unknown>);
  const response = await listVendorInventoryStocks(query, vendorScopeFromRequest(req.user));

  return sendPaginatedResponse({
    res,
    message: 'Vendor inventory stocks fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const getVendorInventoryStockByIdController = asyncHandler(async (req, res) => {
  const stock = await getVendorInventoryStockById(
    requireStringParam(req.params.inventoryStockId),
    vendorScopeFromRequest(req.user),
  );

  return sendSuccessResponse({
    res,
    message: 'Vendor inventory stock fetched successfully',
    data: stock,
  });
});

export const adjustVendorInventoryStockController = asyncHandler(async (req, res) => {
  const updated = await adjustVendorInventoryStock(
    requireStringParam(req.params.inventoryStockId),
    req.body,
    requireActorUserId(req.user?.userId),
    vendorScopeFromRequest(req.user),
  );

  return sendSuccessResponse({
    res,
    message: 'Vendor inventory stock adjusted successfully',
    data: updated,
  });
});

export const listVendorInventoryMovementsController = asyncHandler(async (req, res) => {
  const query = parseMovementListQuery(req.query as Record<string, unknown>);
  const response = await listVendorInventoryMovements(query, vendorScopeFromRequest(req.user));

  return sendPaginatedResponse({
    res,
    message: 'Vendor inventory movements fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});
