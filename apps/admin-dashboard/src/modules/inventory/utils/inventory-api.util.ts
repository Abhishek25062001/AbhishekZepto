import type { ApiPaginationMeta, ApiSuccessResponse } from '../../../types/api.types';

export type PaginatedResult<T> = {
  items: T[];
  pagination: ApiPaginationMeta;
};

export const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const unwrapPaginated = <T>(response: ApiSuccessResponse<T[]>): PaginatedResult<T> => {
  const pagination = response.meta.pagination;

  if (!pagination) {
    return {
      items: response.data,
      pagination: {
        page: 1,
        limit: response.data.length,
        total: response.data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return { items: response.data, pagination };
};
