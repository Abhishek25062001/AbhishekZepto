import { useQuery } from '@tanstack/react-query';

import { getAdminOrderTimeline } from '../api/admin-orders.api';

export function useAdminOrderTimeline(orderId?: string) {
  return useQuery({
    enabled: Boolean(orderId),
    queryKey: ['admin-order-timeline', orderId],
    queryFn: () => getAdminOrderTimeline(orderId ?? ''),
  });
}
