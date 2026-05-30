import { useQuery } from '@tanstack/react-query';

import { getVendorOrderDeliveryStatus } from '../api/vendor-orders.api';
import { useVendorRealtimeStore } from '../../realtime-store-operations/store/vendor-realtime.store';

export function useVendorOrderDeliveryStatus(orderId: string | undefined) {
  const socketConnected = useVendorRealtimeStore((state) => state.socketConnected);

  return useQuery({
    enabled: Boolean(orderId),
    queryKey: ['vendor-order-delivery-status', orderId],
    queryFn: () => getVendorOrderDeliveryStatus(orderId ?? ''),
    refetchInterval: socketConnected ? false : 10000,
  });
}
