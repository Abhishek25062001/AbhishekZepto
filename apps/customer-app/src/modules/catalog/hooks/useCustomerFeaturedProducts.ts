import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerFeaturedProducts } from '../api/customer-catalog.api';
import { buildCatalogQuery } from '../utils/catalog-query.util';

export function useCustomerFeaturedProducts() {
  const cityId = useAuthStore((state) => state.cityId);
  const listQuery = buildCatalogQuery({ cityId: cityId ?? undefined, limit: 20 });

  return useQuery({
    queryKey: ['customer-catalog-featured', listQuery],
    queryFn: () => getCustomerFeaturedProducts(listQuery),
  });
}
