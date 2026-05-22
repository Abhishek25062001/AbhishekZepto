import { useQuery } from '@tanstack/react-query';

import { getCustomerOrderById } from '../api/customer-order.api';
import { getOrderErrorMessage } from '../utils/customer-order-error-message.util';
import { orderQueryKeys } from '../utils/order-query-keys.util';

export function useOrderDetail(orderId: string | undefined) {
  const query = useQuery({
    queryKey: orderQueryKeys.detail(orderId ?? ''),
    queryFn: () => getCustomerOrderById(orderId!),
    enabled: Boolean(orderId),
  });

  const errorMessage = query.isError
    ? getOrderErrorMessage(query.error, 'Could not load order details.')
    : null;

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage,
    refetch: query.refetch,
  };
}
