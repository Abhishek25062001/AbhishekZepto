import { VendorOrderHistoryEmptyState } from '../components/VendorOrderHistoryEmptyState';
import { VendorOrderHistoryErrorState } from '../components/VendorOrderHistoryErrorState';
import { VendorOrderHistoryFilters } from '../components/VendorOrderHistoryFilters';
import { VendorOrderHistoryTable } from '../components/VendorOrderHistoryTable';
import { useVendorOrderHistory } from '../hooks/useVendorOrderHistory';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorOrderHistoryPage() {
  const { data, error, isFetching, isLoading, refetch } = useVendorOrderHistory();
  const orders = data?.items ?? [];

  if (error) {
    return (
      <VendorOrderHistoryErrorState
        message={mapVendorOrderErrorCodeToMessage(
          extractApiErrorCode(error),
          'Unable to load order history.',
        )}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>Order history</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Review store-scoped orders and lifecycle outcomes.
        </p>
      </header>
      <VendorOrderHistoryFilters />
      {isLoading && !data ? (
        <VendorOrderHistoryTable isFetching orders={[]} />
      ) : null}
      {!isLoading && orders.length === 0 ? <VendorOrderHistoryEmptyState /> : null}
      {orders.length > 0 ? (
        <VendorOrderHistoryTable isFetching={isFetching && Boolean(data)} orders={orders} />
      ) : null}
    </section>
  );
}
