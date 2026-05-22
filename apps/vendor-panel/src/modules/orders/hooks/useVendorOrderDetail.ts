import { useQuery } from '@tanstack/react-query';

import { getVendorOrderById } from '../api/vendor-orders.api';

export function useVendorOrderDetail(orderId: string | undefined) {
  return useQuery({
    enabled: Boolean(orderId),
    queryKey: ['vendor-order-detail', orderId],
    queryFn: () => getVendorOrderById(orderId ?? ''),
  });
}
