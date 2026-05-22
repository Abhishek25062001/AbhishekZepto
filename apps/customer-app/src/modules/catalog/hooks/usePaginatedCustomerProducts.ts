import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
  CUSTOMER_CATALOG_DEFAULT_PAGE,
  CUSTOMER_CATALOG_PAGE_LIMIT,
} from '../constants/customer-catalog.constants';
import { getCustomerProducts } from '../api/customer-catalog.api';
import type { CustomerCatalogListQuery } from '../types/customer-catalog-query.types';
import { buildCatalogQuery } from '../utils/catalog-query.util';
import { getCatalogHasNextPage, mergeCatalogPages } from '../utils/catalog-pagination.util';
import { useCatalogLocationQuery } from './useCatalogLocationQuery';

export function usePaginatedCustomerProducts(query: Partial<CustomerCatalogListQuery> = {}) {
  const { cityId, storeId } = useCatalogLocationQuery();

  const listQuery = useMemo(
    () =>
      buildCatalogQuery({
        ...query,
        cityId,
        storeId,
        limit: CUSTOMER_CATALOG_PAGE_LIMIT,
      }),
    [query, cityId, storeId],
  );

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['customer-catalog-products-paginated', listQuery],
    queryFn: ({ pageParam }) =>
      getCustomerProducts({ ...listQuery, page: pageParam }, storeId),
    initialPageParam: CUSTOMER_CATALOG_DEFAULT_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });

  const items = useMemo(
    () => mergeCatalogPages(infiniteQuery.data?.pages.map((page) => page.items) ?? []),
    [infiniteQuery.data?.pages],
  );

  const lastPagination = infiniteQuery.data?.pages.at(-1)?.pagination;
  const hasNextPage = getCatalogHasNextPage(lastPagination, items.length);

  return {
    items,
    pagination: lastPagination,
    total: lastPagination?.total ?? items.length,
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    isLoadingMore: infiniteQuery.isFetchingNextPage,
    isError: infiniteQuery.isError,
    error: infiniteQuery.error,
    hasNextPage,
    loadMore: () => {
      if (hasNextPage && !infiniteQuery.isFetchingNextPage) {
        void infiniteQuery.fetchNextPage();
      }
    },
    refresh: () => infiniteQuery.refetch(),
  };
}
