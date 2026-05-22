import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../../types/api.types';

const ERROR_MESSAGES: Record<string, string> = {
  STORE_NOT_FOUND: 'Store not found.',
  STORE_NOT_SERVICEABLE: 'Selected store is not available for your account.',
  CATALOG_SEARCH_FAILED: 'Unable to load catalog for this store.',
  CATALOG_SEARCH_SCOPE_DENIED: 'Store context is invalid.',
};

export const getCustomerHomeErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const code = axiosError.response?.data?.error?.code;

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return axiosError.response?.data?.message ?? fallback;
};
