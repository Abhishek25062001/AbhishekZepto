import { useMutation, useQueryClient } from '@tanstack/react-query';
import { overrideDeliveryApi, type AdminDeliveryOverrideBody } from '../services/api/delivery.api';

/**
 * Hook to perform an admin override (cancel or fail) on a delivery assignment.
 * On success, invalidates the list and the specific delivery detail query.
 */
export function useAdminOverrideDelivery(deliveryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AdminDeliveryOverrideBody) => overrideDeliveryApi(deliveryId, body),
    onSuccess: async () => {
      // Invalidate list queries so filters/pagination reflect the new state
      await queryClient.invalidateQueries({ queryKey: ['admin-deliveries'] });
      // Invalidate the specific detail query
      await queryClient.invalidateQueries({ queryKey: ['admin-deliveries', 'detail', deliveryId] });
    },
  });
}
