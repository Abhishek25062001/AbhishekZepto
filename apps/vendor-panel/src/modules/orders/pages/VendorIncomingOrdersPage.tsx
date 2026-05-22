import { VendorIncomingOrdersEmptyState } from '../components/VendorIncomingOrdersEmptyState';
import { VendorIncomingOrdersErrorState } from '../components/VendorIncomingOrdersErrorState';
import { VendorIncomingOrdersTable } from '../components/VendorIncomingOrdersTable';
import { useVendorIncomingOrders } from '../hooks/useVendorIncomingOrders';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorIncomingOrdersPage() {
  const { data, error, isFetching, isLoading, refetch } = useVendorIncomingOrders();
  const orders = data?.items ?? [];

  if (error) {
    return (
      <VendorIncomingOrdersErrorState
        message={mapVendorOrderErrorCodeToMessage(
          extractApiErrorCode(error),
          'Unable to load incoming orders.',
        )}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>Incoming orders</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Review newly placed store orders and decide acceptance.
        </p>
      </header>
      {isLoading && !data ? (
        <VendorIncomingOrdersTable isFetching orders={[]} />
      ) : null}
      {!isLoading && orders.length === 0 ? <VendorIncomingOrdersEmptyState /> : null}
      {orders.length > 0 ? (
        <VendorIncomingOrdersTable isFetching={isFetching && Boolean(data)} orders={orders} />
      ) : null}
    </section>
  );
}
