import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorCatalogFacets } from '../api/vendor-catalog.api';
import { parseOptionalBoolean, parseOptionalString } from '../utils/vendor-catalog-query-param.util';
import type { VendorCatalogProductListQuery } from '../types/vendor-catalog.types';

const buildFacetQuery = (searchParams: URLSearchParams): VendorCatalogProductListQuery => ({
  search: parseOptionalString(searchParams.get('search')),
  categoryId: parseOptionalString(searchParams.get('categoryId')),
  subcategoryId: parseOptionalString(searchParams.get('subcategoryId')),
  brandId: parseOptionalString(searchParams.get('brandId')),
  foodType: parseOptionalString(searchParams.get('foodType')) as VendorCatalogProductListQuery['foodType'],
  status: parseOptionalString(searchParams.get('status')) as VendorCatalogProductListQuery['status'],
  isAvailable: parseOptionalBoolean(searchParams.get('isAvailable')),
});

export function useVendorCatalogFacets() {
  const [searchParams] = useSearchParams();
  const query = buildFacetQuery(searchParams);

  return useQuery({
    queryKey: ['vendor-catalog-facets', query],
    queryFn: () => getVendorCatalogFacets(query),
  });
}
