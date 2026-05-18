import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import {
  CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS,
  CUSTOMER_CATALOG_SEARCH_MIN_LENGTH,
} from '../constants/customer-catalog.constants';
import { searchCustomerCatalog } from '../api/customer-catalog.api';
import { buildCatalogQuery } from '../utils/catalog-query.util';

export function useCustomerCatalogSearch(search: string) {
  const cityId = useAuthStore((state) => state.cityId);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const enabled = debouncedSearch.length >= CUSTOMER_CATALOG_SEARCH_MIN_LENGTH;
  const listQuery = buildCatalogQuery({
    cityId: cityId ?? undefined,
  });

  return useQuery({
    queryKey: ['customer-catalog-search', debouncedSearch, listQuery],
    queryFn: () => searchCustomerCatalog({ ...listQuery, q: debouncedSearch }),
    enabled,
  });
}
