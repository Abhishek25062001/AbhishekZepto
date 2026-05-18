import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerProducts } from '../api/customer-catalog.api';
import type { CustomerCatalogListQuery } from '../types/customer-catalog-query.types';
import { buildCatalogQuery } from '../utils/catalog-query.util';

export function useCustomerProducts(query: Partial<CustomerCatalogListQuery> = {}) {
  const cityId = useAuthStore((state) => state.cityId);
  const listQuery = buildCatalogQuery({ ...query, cityId: cityId ?? undefined });

  return useQuery({
    queryKey: ['customer-catalog-products', listQuery],
    queryFn: () => getCustomerProducts(listQuery),
  });
}
