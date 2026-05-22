import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../../types/api.types';

const ERROR_MESSAGES: Record<string, string> = {
  CART_NOT_FOUND: 'Your cart is empty.',
  CART_ITEM_NOT_FOUND: 'This item is no longer in your cart.',
  CART_PRODUCT_UNAVAILABLE: 'This product is not available at your store.',
  CART_INSUFFICIENT_STOCK: 'Not enough stock for this quantity.',
  CART_MAX_QUANTITY_EXCEEDED: 'Maximum quantity per item reached.',
  CART_STORE_MISMATCH: 'Store changed. Please refresh or reselect your store.',
  CART_PRICE_CHANGED: 'Prices have changed. Tap refresh to update your cart.',
  STORE_NOT_FOUND: 'Store not found.',
};

export const getCustomerCartErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const code = axiosError.response?.data?.error?.code;

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return axiosError.response?.data?.message ?? fallback;
};

export const getCustomerCartErrorCode = (error: unknown): string | undefined => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.error?.code;
};

export const isCartNotFoundError = (error: unknown): boolean =>
  getCustomerCartErrorCode(error) === 'CART_NOT_FOUND';

export const isCartPriceChangedError = (error: unknown): boolean =>
  getCustomerCartErrorCode(error) === 'CART_PRICE_CHANGED';
