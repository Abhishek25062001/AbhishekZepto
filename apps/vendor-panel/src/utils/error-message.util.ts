import type { ApiErrorResponse } from '../types/api.types';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!isRecord(value)) {
    return false;
  }

  return value.success === false && typeof value.message === 'string';
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = 'Something went wrong.',
): string => {
  if (isApiErrorResponse(error)) {
    return error.message;
  }

  if (isRecord(error) && isRecord(error.response)) {
    const responseData = error.response.data;

    if (isApiErrorResponse(responseData)) {
      return responseData.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};
