import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminProductUnits } from '../api/product-unit.api';
import type { ProductUnitListQuery } from '../types/product-unit.types';
import {
  parseNumberParam,
  parseOptionalString,
} from '../utils/catalog-query-param.util';

export const buildProductUnitListQuery = (searchParams: URLSearchParams): ProductUnitListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  status: parseOptionalString(searchParams.get('status')) as ProductUnitListQuery['status'],
  baseUnit: parseOptionalString(searchParams.get('baseUnit')) as ProductUnitListQuery['baseUnit'],
  sortBy: parseOptionalString(searchParams.get('sortBy')) as ProductUnitListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as ProductUnitListQuery['sortOrder'],
});

export function useProductUnits() {
  const [searchParams] = useSearchParams();
  const query = buildProductUnitListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-product-units', query],
    queryFn: () => getAdminProductUnits(query),
  });
}
