import { useQuery } from '@tanstack/react-query';

import { getCustomerProducts } from '../api/customer-catalog.api';
import type { CustomerCatalogListQuery } from '../types/customer-catalog-query.types';
import { buildCatalogQuery } from '../utils/catalog-query.util';
import { useCatalogLocationQuery } from './useCatalogLocationQuery';

export function useCustomerProducts(query: Partial<CustomerCatalogListQuery> = {}) {
  const { cityId, storeId } = useCatalogLocationQuery();
  const listQuery = buildCatalogQuery({ ...query, cityId, storeId });

  return useQuery({
    queryKey: ['customer-catalog-products', listQuery],
    queryFn: () => getCustomerProducts(listQuery, storeId),
  });
}
