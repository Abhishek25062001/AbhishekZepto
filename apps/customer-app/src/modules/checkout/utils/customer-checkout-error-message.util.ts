import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../../types/api.types';

const ERROR_MESSAGES: Record<string, string> = {
  CHECKOUT_SESSION_NOT_FOUND: 'Checkout session not found.',
  CHECKOUT_SESSION_EXPIRED: 'Your reservation has expired. Please start checkout again.',
  CHECKOUT_CART_EMPTY: 'Your cart is empty.',
  CHECKOUT_STOCK_UNAVAILABLE: 'Some items are out of stock. Please update your cart.',
  CHECKOUT_PRICE_CHANGED: 'Prices have changed. Please go back to your cart and refresh.',
  CHECKOUT_ADDRESS_UNSERVICEABLE: 'This address is not serviceable for your store.',
  CHECKOUT_STORE_CLOSED: 'The store is not available for checkout right now.',
  ADDRESS_NOT_FOUND: 'Please add or select a delivery address.',
};

export const getCheckoutErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const code = axiosError.response?.data?.error?.code;

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return axiosError.response?.data?.message ?? fallback;
};

export const getCheckoutErrorCode = (error: unknown): string | undefined => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.error?.code;
};

export const isCheckoutSessionNotFoundError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_SESSION_NOT_FOUND';

export const isCheckoutSessionExpiredError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_SESSION_EXPIRED';

export const isCheckoutCartEmptyError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_CART_EMPTY';

export const isCheckoutStockUnavailableError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_STOCK_UNAVAILABLE';

export const isCheckoutPriceChangedError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_PRICE_CHANGED';

export const isCheckoutAddressUnserviceableError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_ADDRESS_UNSERVICEABLE';

export const isCheckoutStoreClosedError = (error: unknown): boolean =>
  getCheckoutErrorCode(error) === 'CHECKOUT_STORE_CLOSED';
