import { Link, useParams } from 'react-router-dom';

import { ErrorView, Loader } from '../../../components/common';
import { VendorCancelOrderAction } from '../components/VendorCancelOrderAction';
import { VendorOrderHistoryDetail } from '../components/VendorOrderHistoryDetail';
import { useVendorOrderDetail } from '../hooks/useVendorOrderDetail';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorOrderHistoryDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, error, isLoading, refetch } = useVendorOrderDetail(orderId);

  if (isLoading) {
    return <Loader label="Loading order history detail" />;
  }

  if (error) {
    return (
      <ErrorView
        message={mapVendorOrderErrorCodeToMessage(
          extractApiErrorCode(error),
          'Unable to load order history detail.',
        )}
        onRetry={() => void refetch()}
        title="Unable to load order history detail"
      />
    );
  }

  if (!data) {
    return (
      <ErrorView
        message="Order history detail was not returned."
        title="Order unavailable"
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <Link to="/orders/history">Back to order history</Link>
      <VendorOrderHistoryDetail order={data} />
      <VendorCancelOrderAction order={data} />
    </section>
  );
}
