import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS,
  CUSTOMER_CATALOG_SEARCH_MIN_LENGTH,
} from '../constants/customer-catalog.constants';
import { searchCustomerCatalog } from '../api/customer-catalog.api';
import { buildCatalogQuery } from '../utils/catalog-query.util';
import { useCatalogLocationQuery } from './useCatalogLocationQuery';

export function useCustomerCatalogSearch(search: string) {
  const { cityId, storeId } = useCatalogLocationQuery();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const enabled = debouncedSearch.length >= CUSTOMER_CATALOG_SEARCH_MIN_LENGTH;
  const listQuery = buildCatalogQuery({
    cityId,
    storeId,
  });

  return useQuery({
    queryKey: ['customer-catalog-search', debouncedSearch, listQuery],
    queryFn: () => searchCustomerCatalog({ ...listQuery, q: debouncedSearch }),
    enabled,
  });
}
