import { useQuery } from '@tanstack/react-query';

import { getAdminOrderById } from '../api/admin-orders.api';

export function useAdminOrderDetail(orderId?: string) {
  return useQuery({
    enabled: Boolean(orderId),
    queryKey: ['admin-order-detail', orderId],
    queryFn: () => getAdminOrderById(orderId ?? ''),
  });
}
