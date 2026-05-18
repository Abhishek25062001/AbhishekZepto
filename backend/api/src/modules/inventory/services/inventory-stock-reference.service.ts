import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { findStoreProductById } from '../../store-products/repositories/store-product.repository';
import { STORE_PRODUCT_STATUS } from '../../store-products/constants/store-product-status.constant';
import {
  INVENTORY_ERROR_CODES,
  type InventoryErrorCode,
} from '../constants/inventory-error-codes.constant';

const inventoryError = (code: InventoryErrorCode): ErrorCode => ERROR_CODES[code];

export const assertStoreProductForInventory = async (storeProductId: string) => {
  const mapping = await findStoreProductById(storeProductId);

  if (!mapping) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVALID_INVENTORY_STORE_PRODUCT),
    });
  }

  if (
    mapping.isDeleted ||
    mapping.status !== STORE_PRODUCT_STATUS.ACTIVE ||
    !mapping.isAvailable ||
    !mapping.isVisible
  ) {
    throw new AppError({
      message: 'Store product mapping is not active or visible',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVALID_INVENTORY_STORE_PRODUCT),
    });
  }

  return mapping;
};
