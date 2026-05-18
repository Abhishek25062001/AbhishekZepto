import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import type { CatalogSortOption } from '../constants/catalog-sort.constant';
import { CATALOG_SEARCH_ERROR_CODES } from '../constants/catalog-search-error-codes.constant';
import type { CatalogSearchSurface } from '../types/catalog-search.types';

export const buildCatalogSort = (
  sortBy: CatalogSortOption | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
  surface: CatalogSearchSurface,
): Record<string, 1 | -1> => {
  const direction = sortOrder === 'asc' ? 1 : -1;

  switch (sortBy) {
    case 'price_low_to_high':
      return { finalPrice: 1 };
    case 'price_high_to_low':
      return { finalPrice: -1 };
    case 'newest':
    case 'createdAt':
      return { 'product.createdAt': -1 };
    case 'featured':
      return { 'product.isFeatured': -1, 'product.createdAt': -1 };
    case 'name_asc':
    case 'name':
      return { 'product.name': direction };
    case 'name_desc':
      return { 'product.name': -1 };
    case 'updated_desc':
    case 'updatedAt':
      return surface === 'admin' ? { updatedAt: -1 } : { 'product.updatedAt': -1 };
    case 'relevance':
      return surface === 'customer' || surface === 'vendor'
        ? { 'product.isFeatured': -1, 'product.createdAt': -1 }
        : { isFeatured: -1, updatedAt: -1 };
    default:
      if (sortBy !== undefined) {
        throw new AppError({
          message: 'Invalid sort option',
          statusCode: HTTP_STATUS.BAD_REQUEST,
          errorCode: ERROR_CODES[CATALOG_SEARCH_ERROR_CODES.CATALOG_SEARCH_INVALID_SORT],
        });
      }

      if (surface === 'admin') {
        return { updatedAt: -1 };
      }

      return { 'product.isFeatured': -1, 'product.createdAt': -1 };
  }
};

export const buildAdminProductSort = (
  sortBy: CatalogSortOption | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
): Record<string, 1 | -1> => {
  const direction = sortOrder === 'asc' ? 1 : -1;

  switch (sortBy) {
    case 'name_asc':
    case 'name':
      return { name: direction };
    case 'name_desc':
      return { name: -1 };
    case 'createdAt':
    case 'newest':
      return { createdAt: -1 };
    case 'featured':
      return { isFeatured: -1, createdAt: -1 };
    case 'updated_desc':
    case 'updatedAt':
      return { updatedAt: -1 };
    case 'relevance':
    default:
      return { updatedAt: -1 };
  }
};
