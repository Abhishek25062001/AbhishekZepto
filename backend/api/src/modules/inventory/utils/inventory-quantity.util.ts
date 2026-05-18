import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { INVENTORY_ERROR_CODES } from '../constants/inventory-error-codes.constant';

const inventoryError = () => ERROR_CODES[INVENTORY_ERROR_CODES.INVALID_INVENTORY_QUANTITY];

export const calculateTotalQuantity = (
  availableQuantity: number,
  reservedQuantity: number,
  damagedQuantity: number,
  expiredQuantity: number,
): number => {
  const values = [availableQuantity, reservedQuantity, damagedQuantity, expiredQuantity];

  if (values.some((value) => value < 0)) {
    throw new AppError({
      message: 'Inventory quantities cannot be negative',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: inventoryError(),
    });
  }

  return availableQuantity + reservedQuantity + damagedQuantity + expiredQuantity;
};

export const calculateStockFlags = (
  availableQuantity: number,
  lowStockThreshold: number,
): { isLowStock: boolean; isOutOfStock: boolean } => ({
  isOutOfStock: availableQuantity <= 0,
  isLowStock: availableQuantity > 0 && availableQuantity <= lowStockThreshold,
});
