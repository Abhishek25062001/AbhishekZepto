export type ApiMeta = Record<string, unknown>;

export type ApiSuccessResponse<TData, TMeta extends ApiMeta = ApiMeta> = {
  data: TData;
  message: string;
  meta: TMeta;
  success: true;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    details: ApiMeta;
  };
  message: string;
  meta?: ApiMeta;
  success: false;
};

export type ApiPaginationMeta = {
  hasNextPage: boolean;
  limit: number;
  page: number;
  total: number;
};
