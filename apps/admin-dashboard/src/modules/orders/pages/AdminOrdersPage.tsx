import { CatalogPagination } from '../../catalog/components/CatalogPagination';
import { AdminOrderEmptyState } from '../components/AdminOrderEmptyState';
import { AdminOrderErrorState } from '../components/AdminOrderErrorState';
import { AdminOrderFilters } from '../components/AdminOrderFilters';
import { AdminOrderTable } from '../components/AdminOrderTable';
import { useAdminOrders } from '../hooks/useAdminOrders';

export function AdminOrdersPage() {
  const { data, error, isFetching, isLoading, refetch } = useAdminOrders();
  const orders = data?.items ?? [];

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
