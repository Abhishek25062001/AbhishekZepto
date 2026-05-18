import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorCatalogProducts } from '../api/vendor-catalog.api';
import type { VendorCatalogProductListQuery } from '../types/vendor-catalog.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/vendor-catalog-query-param.util';

export const buildVendorCatalogProductListQuery = (
  searchParams: URLSearchParams,
): VendorCatalogProductListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  categoryId: parseOptionalString(searchParams.get('categoryId')),
  subcategoryId: parseOptionalString(searchParams.get('subcategoryId')),
  brandId: parseOptionalString(searchParams.get('brandId')),
  foodType: parseOptionalString(searchParams.get('foodType')) as VendorCatalogProductListQuery['foodType'],
  status: parseOptionalString(searchParams.get('status')) as VendorCatalogProductListQuery['status'],
  isVisible: parseOptionalBoolean(searchParams.get('isVisible')),
  isFeatured: parseOptionalBoolean(searchParams.get('isFeatured')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as VendorCatalogProductListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as VendorCatalogProductListQuery['sortOrder'],
});

export function useVendorCatalogProducts() {
  const [searchParams] = useSearchParams();
  const query = buildVendorCatalogProductListQuery(searchParams);

  return useQuery({
    queryKey: ['vendor-catalog-products', query],
    queryFn: () => getVendorCatalogProducts(query),
  });
}
