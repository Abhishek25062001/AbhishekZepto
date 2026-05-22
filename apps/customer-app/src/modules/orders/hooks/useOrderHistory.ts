import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCustomerOrders } from '../api/customer-order.api';
import { getOrderErrorMessage } from '../utils/customer-order-error-message.util';
import { orderQueryKeys } from '../utils/order-query-keys.util';

const DEFAULT_LIMIT = 20;

export function useOrderHistory() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: orderQueryKeys.list({ page, limit: DEFAULT_LIMIT }),
    queryFn: () =>
      getCustomerOrders({
        page,
        limit: DEFAULT_LIMIT,
      }),
  });

  const errorMessage = query.isError
    ? getOrderErrorMessage(query.error, 'Could not load your orders.')
    : null;

  const pagination = query.data?.pagination;

  return {
    orders: query.data?.orders ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isFetching && !query.isLoading,
    errorMessage,
    refetch: query.refetch,
    page,
    setPage,
    hasNextPage: pagination?.hasNextPage ?? false,
    hasPreviousPage: pagination?.hasPreviousPage ?? false,
    total: pagination?.total ?? 0,
  };
}
