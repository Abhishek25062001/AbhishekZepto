import { useQuery } from '@tanstack/react-query';

import { getCustomerOrderLifecycle } from '../api/customer-order.api';
import { getOrderErrorMessage } from '../utils/customer-order-error-message.util';
import { orderQueryKeys } from '../utils/order-query-keys.util';

export function useOrderLifecycle(orderId: string | undefined) {
  const query = useQuery({
    queryKey: orderQueryKeys.lifecycle(orderId ?? ''),
    queryFn: () => getCustomerOrderLifecycle(orderId!),
    enabled: Boolean(orderId),
  });

  const errorMessage = query.isError
    ? getOrderErrorMessage(query.error, 'Could not load order timeline.')
    : null;

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage,
    refetch: query.refetch,
  };
}
