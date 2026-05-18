import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminCities } from '../api/city.api';
import type { CityListQuery } from '../types/city.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/store-query-param.util';

export const buildCityListQuery = (searchParams: URLSearchParams): CityListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  status: parseOptionalString(searchParams.get('status')) as CityListQuery['status'],
  isServiceable: parseOptionalBoolean(searchParams.get('isServiceable')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as CityListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as CityListQuery['sortOrder'],
});

export function useCities() {
  const [searchParams] = useSearchParams();
  const query = buildCityListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-cities', query],
    queryFn: () => getAdminCities(query),
  });
}
