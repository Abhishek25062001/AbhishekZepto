import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../../types/api.types';

const ERROR_MESSAGES: Record<string, string> = {
  ADDRESS_NOT_FOUND: 'Address not found.',
  ADDRESS_NOT_OWNED: 'You do not have access to this address.',
  SERVICEABILITY_AREA_UNAVAILABLE: 'We do not deliver to this location yet.',
  STORE_NOT_SERVICEABLE: 'This store cannot deliver to the selected address.',
  STORE_NOT_FOUND: 'Store not found.',
  LOCATION_INVALID: 'Invalid location coordinates.',
};

export const getCustomerAddressErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const code = axiosError.response?.data?.error?.code;

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return axiosError.response?.data?.message ?? fallback;
};
