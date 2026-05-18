import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminServiceAreas } from '../api/service-area.api';
import type { ServiceAreaListQuery } from '../types/service-area.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/store-query-param.util';

export const buildServiceAreaListQuery = (searchParams: URLSearchParams): ServiceAreaListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  cityId: parseOptionalString(searchParams.get('cityId')),
  search: parseOptionalString(searchParams.get('search')),
  status: parseOptionalString(searchParams.get('status')) as ServiceAreaListQuery['status'],
  isServiceable: parseOptionalBoolean(searchParams.get('isServiceable')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as ServiceAreaListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as ServiceAreaListQuery['sortOrder'],
});

export function useServiceAreas() {
  const [searchParams] = useSearchParams();
  const query = buildServiceAreaListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-service-areas', query],
    queryFn: () => getAdminServiceAreas(query),
  });
}
