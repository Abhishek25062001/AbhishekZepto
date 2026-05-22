import { Link, useParams } from 'react-router-dom';

import { ErrorView, Loader } from '../../../components/common';
import { VendorIncomingOrderDetail } from '../components/VendorIncomingOrderDetail';
import { VendorStartPickingAction } from '../components/VendorStartPickingAction';
import { useVendorOrderDetail } from '../hooks/useVendorOrderDetail';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorIncomingOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, error, isLoading, refetch } = useVendorOrderDetail(orderId);

  if (isLoading) {
    return <Loader label="Loading order" />;
  }

  if (error) {
    return (
      <ErrorView
        message={mapVendorOrderErrorCodeToMessage(
          extractApiErrorCode(error),
          'Unable to load order detail.',
        )}
        onRetry={() => void refetch()}
        title="Unable to load order"
      />
    );
  }

  if (!data) {
    return (
      <ErrorView
        message="Order detail was not returned."
        title="Order unavailable"
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <Link to="/orders">Back to incoming orders</Link>
      <VendorIncomingOrderDetail order={data} />
      <VendorStartPickingAction order={data} />
    </section>
  );
}
