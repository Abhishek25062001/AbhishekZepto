import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminStores } from '../api/store.api';
import type { StoreListQuery } from '../types/store.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/store-query-param.util';

export const buildStoreListQuery = (searchParams: URLSearchParams): StoreListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  vendorId: parseOptionalString(searchParams.get('vendorId')),
  cityId: parseOptionalString(searchParams.get('cityId')),
  serviceAreaId: parseOptionalString(searchParams.get('serviceAreaId')),
  status: parseOptionalString(searchParams.get('status')) as StoreListQuery['status'],
  isOpen: parseOptionalBoolean(searchParams.get('isOpen')),
  isAcceptingOrders: parseOptionalBoolean(searchParams.get('isAcceptingOrders')),
  storeType: parseOptionalString(searchParams.get('storeType')) as StoreListQuery['storeType'],
  fulfillmentType: parseOptionalString(searchParams.get('fulfillmentType')) as StoreListQuery['fulfillmentType'],
  sortBy: parseOptionalString(searchParams.get('sortBy')) as StoreListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as StoreListQuery['sortOrder'],
});

export function useStores() {
  const [searchParams] = useSearchParams();
  const query = buildStoreListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-stores', query],
    queryFn: () => getAdminStores(query),
  });
}
