import { useQuery } from '@tanstack/react-query';

import { getCustomerOrderDelivery } from '../api/customer-order.api';
import { getOrderErrorMessage } from '../utils/customer-order-error-message.util';
import { orderQueryKeys } from '../utils/order-query-keys.util';

export function useOrderDelivery(orderId: string | undefined) {
  const query = useQuery({
    queryKey: orderQueryKeys.delivery(orderId ?? ''),
    queryFn: () => getCustomerOrderDelivery(orderId!),
    enabled: Boolean(orderId),
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const errorMessage = query.isError
    ? getOrderErrorMessage(query.error, 'Could not load order delivery tracking.')
    : null;

  return {
    delivery: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage,
    refetch: query.refetch,
  };
}
