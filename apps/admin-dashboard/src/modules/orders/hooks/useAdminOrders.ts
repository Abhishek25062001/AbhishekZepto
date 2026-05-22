import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminOrders } from '../api/admin-orders.api';
import { buildAdminOrderListQuery } from '../utils/admin-orders-query.util';

export function useAdminOrders() {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => buildAdminOrderListQuery(searchParams), [searchParams]);

  return useQuery({
    queryKey: ['admin-orders', query],
    queryFn: () => getAdminOrders(query),
  });
}
