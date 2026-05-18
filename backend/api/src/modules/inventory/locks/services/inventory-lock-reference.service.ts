import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { INVENTORY_ERROR_CODES } from '../../constants/inventory-error-codes.constant';
import { INVENTORY_STOCK_STATUS } from '../../constants/inventory-stock-status.constant';
import { findInventoryStockById } from '../../repositories/inventory-stock.repository';
import type { InventoryStockRecord } from '../../models/inventory-stock.model';
import {
  INVENTORY_LOCK_ERROR_CODES,
  type InventoryLockErrorCode,
} from '../constants/inventory-lock-error-codes.constant';

const lockError = (code: InventoryLockErrorCode): ErrorCode => ERROR_CODES[code];
const stockError = (code: (typeof INVENTORY_ERROR_CODES)[keyof typeof INVENTORY_ERROR_CODES]): ErrorCode =>
  ERROR_CODES[code];

export const assertInventoryStockForLock = async (
  inventoryStockId: string,
  storeProductId: string,
): Promise<InventoryStockRecord & { _id: import('mongoose').Types.ObjectId }> => {
  const stock = await findInventoryStockById(inventoryStockId);

  if (!stock || stock.isDeleted) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: stockError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  if (stock.status !== INVENTORY_STOCK_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Inventory stock is not active',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: stockError(INVENTORY_ERROR_CODES.INVALID_INVENTORY_STATUS),
    });
  }

  if (stock.storeProductId.toString() !== storeProductId) {
    throw new AppError({
      message: 'Store product does not match inventory stock',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_STOCK_MISMATCH),
    });
  }

  return stock;
};
