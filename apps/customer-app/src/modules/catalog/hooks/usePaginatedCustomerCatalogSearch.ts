import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
  CUSTOMER_CATALOG_DEFAULT_PAGE,
  CUSTOMER_CATALOG_PAGE_LIMIT,
  CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS,
  CUSTOMER_CATALOG_SEARCH_MIN_LENGTH,
} from '../constants/customer-catalog.constants';
import { searchCustomerCatalog } from '../api/customer-catalog.api';
import type { CustomerCatalogListQuery } from '../types/customer-catalog-query.types';
import { buildCatalogQuery } from '../utils/catalog-query.util';
import { getCatalogHasNextPage, mergeCatalogPages } from '../utils/catalog-pagination.util';
import { useCatalogLocationQuery } from './useCatalogLocationQuery';

export function usePaginatedCustomerCatalogSearch(
  search: string,
  query: Partial<CustomerCatalogListQuery> = {},
) {
  const { cityId, storeId } = useCatalogLocationQuery();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const enabled = debouncedSearch.length >= CUSTOMER_CATALOG_SEARCH_MIN_LENGTH;

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
    queryKey: ['customer-catalog-search-paginated', debouncedSearch, listQuery],
    queryFn: ({ pageParam }) =>
      searchCustomerCatalog({
        ...listQuery,
        page: pageParam,
        q: debouncedSearch,
      }),
    initialPageParam: CUSTOMER_CATALOG_DEFAULT_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    enabled,
  });

  const items = useMemo(
    () => mergeCatalogPages(infiniteQuery.data?.pages.map((page) => page.items) ?? []),
    [infiniteQuery.data?.pages],
  );

  const lastPagination = infiniteQuery.data?.pages.at(-1)?.pagination;
  const hasNextPage = getCatalogHasNextPage(lastPagination, items.length);

  return {
    debouncedSearch,
    items,
    pagination: lastPagination,
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    isLoadingMore: infiniteQuery.isFetchingNextPage,
    isError: infiniteQuery.isError,
    error: infiniteQuery.error,
    hasNextPage,
    enabled,
    loadMore: () => {
      if (hasNextPage && !infiniteQuery.isFetchingNextPage) {
        void infiniteQuery.fetchNextPage();
      }
    },
    refresh: () => infiniteQuery.refetch(),
  };
}
