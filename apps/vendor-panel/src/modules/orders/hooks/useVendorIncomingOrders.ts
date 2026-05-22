import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorOrders } from '../api/vendor-orders.api';
import type { VendorOrderListQuery } from '../types/vendor-orders.types';
import { buildIncomingOrdersQuery } from '../utils/vendor-orders-query.util';

const parseNumberParam = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const buildVendorIncomingOrdersQuery = (
  searchParams: URLSearchParams,
): VendorOrderListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
});

export function useVendorIncomingOrders() {
  const [searchParams] = useSearchParams();
  const query = buildIncomingOrdersQuery(buildVendorIncomingOrdersQuery(searchParams));

  return useQuery({
    queryKey: ['vendor-incoming-orders', query],
    queryFn: () => getVendorOrders(query),
  });
}
