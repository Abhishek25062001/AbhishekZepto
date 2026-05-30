import { useQuery } from '@tanstack/react-query';
import { listAdminDeliveriesApi, type AdminDeliveryListQuery } from '../services/api/delivery.api';

/**
 * Hook to list all delivery assignments with optional filters and pagination.
 * Query key: ['admin-deliveries', filters]
 */
export function useAdminDeliveries(filters: AdminDeliveryListQuery = {}) {
  return useQuery({
    queryKey: ['admin-deliveries', filters],
    queryFn: () => listAdminDeliveriesApi(filters),
  });
}
