import { Link, useParams } from 'react-router-dom';

import { ErrorView, Loader } from '../../../components/common';
import { VendorCompletePickingAction } from '../components/VendorCompletePickingAction';
import { VendorIncomingOrderDetail } from '../components/VendorIncomingOrderDetail';
import { VendorPackingActions } from '../components/VendorPackingActions';
import { VendorPickingItemsTable } from '../components/VendorPickingItemsTable';
import { VendorStartPickingAction } from '../components/VendorStartPickingAction';
import { useVendorOrderDetail } from '../hooks/useVendorOrderDetail';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorActiveOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, error, isLoading, refetch } = useVendorOrderDetail(orderId);

  if (isLoading) {
    return <Loader label="Loading active order" />;
  }

  if (error) {
    return (
      <ErrorView
        message={mapVendorOrderErrorCodeToMessage(
          extractApiErrorCode(error),
          'Unable to load active order detail.',
        )}
        onRetry={() => void refetch()}
        title="Unable to load active order"
      />
    );
  }

  if (!data) {
    return (
      <ErrorView
        message="Active order detail was not returned."
        title="Order unavailable"
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <Link to="/orders/active">Back to active orders</Link>
      <VendorIncomingOrderDetail order={data} />
      <VendorPickingItemsTable order={data} />
      <VendorStartPickingAction order={data} />
      <VendorCompletePickingAction order={data} />
      <VendorPackingActions order={data} />
    </section>
  );
}
