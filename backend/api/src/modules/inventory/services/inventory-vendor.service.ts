import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { VENDOR_INVENTORY_ADJUSTMENT_TYPES } from '../movements/constants/inventory-movement-type.constant';
import { INVENTORY_AUDIT_EVENTS } from '../constants/inventory-audit-events.constant';
import {
  INVENTORY_ERROR_CODES,
  type InventoryErrorCode,
} from '../constants/inventory-error-codes.constant';
import { findInventoryStockById } from '../repositories/inventory-stock.repository';
import type {
  InventoryAdjustmentInput,
  InventoryStockListQuery,
  VendorInventoryScope,
} from '../types/inventory-stock.types';
import {
  adjustInventoryStock,
  getInventoryStockById,
  listInventoryStocks,
} from './inventory-stock.service';
import { listInventoryMovements } from '../movements/services/inventory-movement.service';
import type { InventoryMovementListQuery } from '../movements/types/inventory-movement.types';

const inventoryError = (code: InventoryErrorCode): ErrorCode => ERROR_CODES[code];

const assertVendorScope = (
  stock: { vendorId: { toString(): string }; storeId: { toString(): string } },
  scope: VendorInventoryScope,
) => {
  if (scope.vendorId && stock.vendorId.toString() !== scope.vendorId) {
    throw new AppError({
      message: 'Inventory stock is outside vendor scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_SCOPE_DENIED),
    });
  }

  if (scope.storeId && stock.storeId.toString() !== scope.storeId) {
    throw new AppError({
      message: 'Inventory stock is outside store scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_SCOPE_DENIED),
    });
  }
};

export const listVendorInventoryStocks = async (
  query: InventoryStockListQuery,
  scope: VendorInventoryScope,
) => {
  if (!scope.vendorId || !scope.storeId) {
    throw new AppError({
      message: 'Vendor store scope is required',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_SCOPE_DENIED),
    });
  }

  return listInventoryStocks({
    ...query,
    vendorId: scope.vendorId,
    storeId: scope.storeId,
  });
};

export const getVendorInventoryStockById = async (
  inventoryStockId: string,
  scope: VendorInventoryScope,
) => {
  const stock = await findInventoryStockById(inventoryStockId);

  if (!stock) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  assertVendorScope(stock, scope);

  return getInventoryStockById(inventoryStockId);
};

export const adjustVendorInventoryStock = async (
  inventoryStockId: string,
  input: InventoryAdjustmentInput,
  actorUserId: string,
  scope: VendorInventoryScope,
) => {
  const stock = await findInventoryStockById(inventoryStockId);

  if (!stock) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  assertVendorScope(stock, scope);

  return adjustInventoryStock(inventoryStockId, input, actorUserId, {
    allowedMovementTypes: VENDOR_INVENTORY_ADJUSTMENT_TYPES,
    auditEvent: INVENTORY_AUDIT_EVENTS.INVENTORY_VENDOR_STOCK_ADJUSTED,
    actorSurface: 'vendor_panel',
  });
};

export const listVendorInventoryMovements = async (
  query: InventoryMovementListQuery,
  scope: VendorInventoryScope,
) => listInventoryMovements(query, scope);
