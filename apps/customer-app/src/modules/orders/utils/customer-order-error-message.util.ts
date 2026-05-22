import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../../types/api.types';

const ERROR_MESSAGES: Record<string, string> = {
  ORDER_NOT_FOUND: 'Order not found.',
  ORDER_NOT_OWNED: 'You do not have access to this order.',
  ORDER_ALREADY_EXISTS: 'This order already exists.',
  ORDER_CANCELLATION_NOT_ALLOWED: 'This order can no longer be cancelled.',
  ORDER_CANCELLATION_REASON_REQUIRED: 'Cancellation reason is required.',
  ORDER_CREATION_FAILED: 'We could not confirm your order. Please contact support.',
};

export const getOrderErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const code = axiosError.response?.data?.error?.code;

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return axiosError.response?.data?.message ?? fallback;
};

export const getOrderErrorCode = (error: unknown): string | undefined => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.error?.code;
};

export const isOrderNotFoundError = (error: unknown): boolean =>
  getOrderErrorCode(error) === 'ORDER_NOT_FOUND';
