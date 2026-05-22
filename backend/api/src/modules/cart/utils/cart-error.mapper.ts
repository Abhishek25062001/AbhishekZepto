import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { CART_ERROR_CODES, type CartErrorCode } from '../constants/cart-error-codes.constant';

const toErrorCode = (code: CartErrorCode): ErrorCode => ERROR_CODES[code];

export const cartNotFoundError = (): AppError =>
  new AppError({
    message: 'Cart not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_NOT_FOUND),
  });

export const cartItemNotFoundError = (): AppError =>
  new AppError({
    message: 'Cart item not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_ITEM_NOT_FOUND),
  });

export const cartProductUnavailableError = (): AppError =>
  new AppError({
    message: 'Product is not available at this store',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_PRODUCT_UNAVAILABLE),
  });

export const cartInsufficientStockError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Insufficient stock for requested quantity',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_INSUFFICIENT_STOCK),
    details: details ?? {},
  });

export const cartMaxQuantityExceededError = (): AppError =>
  new AppError({
    message: 'Quantity exceeds maximum allowed per line',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_MAX_QUANTITY_EXCEEDED),
  });

export const cartStoreMismatchError = (): AppError =>
  new AppError({
    message: 'Store does not match your selected store',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_STORE_MISMATCH),
  });

export const cartStoreNotFoundError = (): AppError =>
  new AppError({
    message: 'Store not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(CART_ERROR_CODES.STORE_NOT_FOUND),
  });

export const cartPriceChangedError = (
  changedItems: Array<{ itemId: string; oldPrice: number; newPrice: number }>,
): AppError =>
  new AppError({
    message: 'Cart prices have changed. Please refresh your cart.',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CART_ERROR_CODES.CART_PRICE_CHANGED),
    details: { changedItems },
  });
