import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerCatalogFacets } from '../api/customer-catalog.api';
import { buildCatalogQuery } from '../utils/catalog-query.util';
import { useCatalogFilterStore } from '../store/catalog-filter.store';

export function useCustomerCatalogFacets() {
  const cityId = useAuthStore((state) => state.cityId);
  const filters = useCatalogFilterStore();

  const query = buildCatalogQuery({
    categoryId: filters.categoryId,
    subcategoryId: filters.subcategoryId,
    brandId: filters.brandId,
    foodType: filters.foodType,
    availability: filters.availability,
    cityId: cityId ?? undefined,
  });

  return useQuery({
    queryKey: ['customer-catalog-facets', query],
    queryFn: () => getCustomerCatalogFacets(query),
  });
}
