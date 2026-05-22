import { useQuery } from '@tanstack/react-query';

import { getCustomerCatalogFacets } from '../api/customer-catalog.api';
import { buildCatalogQuery } from '../utils/catalog-query.util';
import { useCatalogFilterStore } from '../store/catalog-filter.store';
import { useCatalogLocationQuery } from './useCatalogLocationQuery';

export function useCustomerCatalogFacets() {
  const { cityId, storeId } = useCatalogLocationQuery();
  const filters = useCatalogFilterStore();

  const query = buildCatalogQuery({
    categoryId: filters.categoryId,
    subcategoryId: filters.subcategoryId,
    brandId: filters.brandId,
    foodType: filters.foodType,
    availability: filters.availability,
    cityId,
    storeId,
  });

  return useQuery({
    queryKey: ['customer-catalog-facets', query],
    queryFn: () => getCustomerCatalogFacets(query),
  });
}
