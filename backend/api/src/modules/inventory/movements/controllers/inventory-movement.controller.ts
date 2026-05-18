import { sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { InventoryMovementListQuery } from '../types/inventory-movement.types';
import { getInventoryMovementById, listInventoryMovements } from '../services/inventory-movement.service';

const parseMovementListQuery = (query: Record<string, unknown>): InventoryMovementListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  storeId: typeof query.storeId === 'string' ? query.storeId : undefined,
  vendorId: typeof query.vendorId === 'string' ? query.vendorId : undefined,
  cityId: typeof query.cityId === 'string' ? query.cityId : undefined,
  inventoryStockId: typeof query.inventoryStockId === 'string' ? query.inventoryStockId : undefined,
  storeProductId: typeof query.storeProductId === 'string' ? query.storeProductId : undefined,
  productId: typeof query.productId === 'string' ? query.productId : undefined,
  variantId: typeof query.variantId === 'string' ? query.variantId : undefined,
  movementType:
    typeof query.movementType === 'string'
      ? (query.movementType as InventoryMovementListQuery['movementType'])
      : undefined,
  referenceType:
    typeof query.referenceType === 'string'
      ? (query.referenceType as InventoryMovementListQuery['referenceType'])
      : undefined,
  referenceId: typeof query.referenceId === 'string' ? query.referenceId : undefined,
  fromDate: typeof query.fromDate === 'string' ? query.fromDate : undefined,
  toDate: typeof query.toDate === 'string' ? query.toDate : undefined,
  sortBy: typeof query.sortBy === 'string' ? (query.sortBy as InventoryMovementListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as InventoryMovementListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

export const listInventoryMovementsController = asyncHandler(async (req, res) => {
  const query = parseMovementListQuery(req.query as Record<string, unknown>);
  const response = await listInventoryMovements(query);

  return sendPaginatedResponse({
    res,
    message: 'Inventory movements fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const getInventoryMovementByIdController = asyncHandler(async (req, res) => {
  const movement = await getInventoryMovementById(requireStringParam(req.params.movementId));

  return sendSuccessResponse({
    res,
    message: 'Inventory movement fetched successfully',
    data: movement,
  });
});
