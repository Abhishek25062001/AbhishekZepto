import { VendorActiveOrdersEmptyState } from '../components/VendorActiveOrdersEmptyState';
import { VendorActiveOrdersErrorState } from '../components/VendorActiveOrdersErrorState';
import { VendorActiveOrdersTable } from '../components/VendorActiveOrdersTable';
import { useVendorActiveOrders } from '../hooks/useVendorActiveOrders';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorActiveOrdersPage() {
  const { data, error, isFetching, isLoading, refetch } = useVendorActiveOrders();
  const orders = data?.items ?? [];

  if (error) {
    return (
      <VendorActiveOrdersErrorState
        message={mapVendorOrderErrorCodeToMessage(
          extractApiErrorCode(error),
          'Unable to load active orders.',
        )}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>Active orders</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Track accepted orders through picking, packing, and pickup readiness.
        </p>
      </header>
      {isLoading && !data ? (
        <VendorActiveOrdersTable isFetching orders={[]} />
      ) : null}
      {!isLoading && orders.length === 0 ? <VendorActiveOrdersEmptyState /> : null}
      {orders.length > 0 ? (
        <VendorActiveOrdersTable isFetching={isFetching && Boolean(data)} orders={orders} />
      ) : null}
    </section>
  );
}
