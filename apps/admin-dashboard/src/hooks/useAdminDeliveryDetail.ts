import { useQuery } from '@tanstack/react-query';
import { getAdminDeliveryDetailApi } from '../services/api/delivery.api';

/**
 * Hook to fetch full delivery assignment detail including timeline and agent snapshot.
 * Query key: ['admin-deliveries', 'detail', deliveryId]
 */
export function useAdminDeliveryDetail(deliveryId: string | undefined) {
  return useQuery({
    queryKey: ['admin-deliveries', 'detail', deliveryId],
    queryFn: () => getAdminDeliveryDetailApi(deliveryId!),
    enabled: Boolean(deliveryId),
  });
}
