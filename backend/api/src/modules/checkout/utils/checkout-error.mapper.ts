import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  CHECKOUT_ERROR_CODES,
  type CheckoutErrorCode,
} from '../constants/checkout-error-codes.constant';

const toErrorCode = (code: CheckoutErrorCode): ErrorCode => ERROR_CODES[code];

export const checkoutSessionNotFoundError = (): AppError =>
  new AppError({
    message: 'Checkout session not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_SESSION_NOT_FOUND),
  });

export const checkoutSessionExpiredError = (): AppError =>
  new AppError({
    message: 'Checkout session has expired',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_SESSION_EXPIRED),
  });

export const checkoutCartEmptyError = (): AppError =>
  new AppError({
    message: 'Cart is empty',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_CART_EMPTY),
  });

export const checkoutStockUnavailableError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Stock unavailable for checkout',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_STOCK_UNAVAILABLE),
    details: details ?? {},
  });

export const checkoutPriceChangedError = (
  changedItems: Array<{ itemId: string; oldPrice: number; newPrice: number }>,
): AppError =>
  new AppError({
    message: 'Cart prices have changed. Please refresh your cart.',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_PRICE_CHANGED),
    details: { changedItems },
  });

export const checkoutAddressUnserviceableError = (): AppError =>
  new AppError({
    message: 'Delivery address is not serviceable for this store',
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_ADDRESS_UNSERVICEABLE),
  });

export const checkoutStoreClosedError = (): AppError =>
  new AppError({
    message: 'Store is not available for checkout',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(CHECKOUT_ERROR_CODES.CHECKOUT_STORE_CLOSED),
  });
