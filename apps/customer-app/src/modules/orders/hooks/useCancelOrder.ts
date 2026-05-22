import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelCustomerOrder } from '../api/customer-order.api';
import { getOrderErrorMessage } from '../utils/customer-order-error-message.util';
import { orderQueryKeys } from '../utils/order-query-keys.util';

type CancelOrderVariables = {
  orderId: string;
  reason: string;
};

export function useCancelOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ orderId, reason }: CancelOrderVariables) =>
      cancelCustomerOrder(orderId, { reason: reason.trim() }),
    onSuccess: async (_order, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(variables.orderId) }),
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.state(variables.orderId) }),
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.lifecycle(variables.orderId) }),
      ]);
    },
  });

  return {
    cancelOrder: mutation.mutateAsync,
    errorMessage: mutation.isError
      ? getOrderErrorMessage(mutation.error, 'Could not cancel this order.')
      : null,
    isCancelling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
