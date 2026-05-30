import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CatalogPagination } from '../../catalog/components/CatalogPagination';
import { useAdminRealtimeStore } from '../../realtime-control-tower/store/admin-realtime.store';
import { applyAdminRealtimeOrderEventToAdminOrdersList } from '../../realtime-control-tower/utils/admin-orders-realtime.util';
import { AdminOrderEmptyState } from '../components/AdminOrderEmptyState';
import { AdminOrderErrorState } from '../components/AdminOrderErrorState';
import { AdminOrderFilters } from '../components/AdminOrderFilters';
import { AdminOrderTable } from '../components/AdminOrderTable';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { buildAdminOrderListQuery } from '../utils/admin-orders-query.util';

export function AdminOrdersPage() {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => buildAdminOrderListQuery(searchParams), [searchParams]);
  const { data, error, isFetching, isLoading, refetch } = useAdminOrders();
  const lastOrderEvent = useAdminRealtimeStore((state) => state.lastOrderEvent);
  const orders = applyAdminRealtimeOrderEventToAdminOrdersList(
    data?.items ?? [],
    lastOrderEvent,
    query,
  );

  if (error) {
    return (
      <>
        <h1>Orders</h1>
        <AdminOrderErrorState onRetry={() => void refetch()} />
      </>
    );
  }

  return (
    <>
      <h1>Orders</h1>
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <AdminOrderFilters />
        <AdminOrderTable loading={isLoading || isFetching} orders={orders} />
        {!isLoading && orders.length === 0 ? <AdminOrderEmptyState /> : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
    </>
  );
}
