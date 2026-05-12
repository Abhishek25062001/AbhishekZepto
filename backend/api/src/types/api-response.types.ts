export type ApiMeta = Record<string, unknown>;

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta: ApiMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    details: ApiMeta;
  };
  meta: ApiMeta;
};

export type ApiPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiPaginatedResponse<T> = ApiSuccessResponse<T[]> & {
  meta: {
    pagination: ApiPaginationMeta;
  } & ApiMeta;
};
