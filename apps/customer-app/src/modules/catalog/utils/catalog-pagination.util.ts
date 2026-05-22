import type { ApiPaginationMeta } from '../../../types/api.types';
import type { CustomerProduct } from '../types/customer-product.types';

import { CUSTOMER_CATALOG_DEFAULT_PAGE } from '../constants/customer-catalog.constants';

export const mergeCatalogPages = (pages: CustomerProduct[][]): CustomerProduct[] => {
  const seen = new Set<string>();
  const merged: CustomerProduct[] = [];

  for (const page of pages) {
    for (const product of page) {
      if (seen.has(product.id)) {
        continue;
      }
      seen.add(product.id);
      merged.push(product);
    }
  }

  return merged;
};

export const getCatalogHasNextPage = (
  pagination: ApiPaginationMeta | undefined,
  loadedCount?: number,
): boolean => {
  if (!pagination) {
    return false;
  }

  if (loadedCount !== undefined) {
    return loadedCount < pagination.total;
  }

  if (pagination.hasNextPage !== undefined) {
    return pagination.hasNextPage;
  }

  return pagination.page * pagination.limit < pagination.total;
};

export const getInitialCatalogPage = () => CUSTOMER_CATALOG_DEFAULT_PAGE;
