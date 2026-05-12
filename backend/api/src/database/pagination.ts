export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type PaginationOptions = {
  page: number;
  limit: number;
  skip: number;
};

export type PaginationResult = {
  page: number;
  limit: number;
  skip: number;
  total: number;
  hasNextPage: boolean;
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const getPaginationOptions = (query: PaginationQuery = {}): PaginationOptions => {
  const page = Math.max(Number(query.page || DEFAULT_PAGE), DEFAULT_PAGE);
  const requestedLimit = Math.max(Number(query.limit || DEFAULT_LIMIT), 1);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};
