import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { CATALOG_SEARCH_ERROR_CODES } from '../constants/catalog-search-error-codes.constant';

const MAX_SEARCH_LENGTH = 100;

export const normalizeSearchQuery = (search?: string): string | undefined => {
  if (search === undefined || search === null) {
    return undefined;
  }

  const normalized = search.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return undefined;
  }

  if (normalized.length > MAX_SEARCH_LENGTH) {
    throw new AppError({
      message: 'Search query is too long',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES[CATALOG_SEARCH_ERROR_CODES.CATALOG_SEARCH_QUERY_TOO_LONG],
    });
  }

  return normalized;
};

export const buildSearchRegex = (search: string): RegExp => {
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'i');
};

export const buildProductTextSearchFilter = (search?: string) => {
  const normalized = normalizeSearchQuery(search);

  if (!normalized) {
    return {};
  }

  const regex = buildSearchRegex(normalized);

  return {
    $or: [
      { name: regex },
      { slug: regex },
      { searchKeywords: regex },
      { tags: regex },
      { shortDescription: regex },
    ],
  };
};
