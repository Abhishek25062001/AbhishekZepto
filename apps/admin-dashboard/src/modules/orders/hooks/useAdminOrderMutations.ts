import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelAdminOrder, updateAdminOrderStatus } from '../api/admin-orders.api';
import type {
  AdminOrderCancellationPayload,
  AdminOrderStatusUpdatePayload,
} from '../types/admin-orders.types';

export function useAdminOrderMutations(orderId: string) {
  const queryClient = useQueryClient();

  const invalidateOrderQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', orderId] }),
      queryClient.invalidateQueries({ queryKey: ['admin-order-timeline', orderId] }),
    ]);
  };

  const updateStatusMutation = useMutation({
    mutationFn: (payload: AdminOrderStatusUpdatePayload) => updateAdminOrderStatus(orderId, payload),
    onSuccess: invalidateOrderQueries,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (payload: AdminOrderCancellationPayload) => cancelAdminOrder(orderId, payload),
    onSuccess: invalidateOrderQueries,
  });

  return {
    cancelOrderMutation,
    updateStatusMutation,
  };
}
