import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminBrands } from '../api/brand.api';
import type { BrandListQuery } from '../types/brand.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/catalog-query-param.util';

export const buildBrandListQuery = (searchParams: URLSearchParams): BrandListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  status: parseOptionalString(searchParams.get('status')) as BrandListQuery['status'],
  isVisible: parseOptionalBoolean(searchParams.get('isVisible')),
  isFeatured: parseOptionalBoolean(searchParams.get('isFeatured')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as BrandListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as BrandListQuery['sortOrder'],
});

export function useBrands() {
  const [searchParams] = useSearchParams();
  const query = buildBrandListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-brands', query],
    queryFn: () => getAdminBrands(query),
  });
}
