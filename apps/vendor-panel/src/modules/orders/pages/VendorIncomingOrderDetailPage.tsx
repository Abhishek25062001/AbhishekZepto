import { Link, useParams } from 'react-router-dom';

import { ErrorView, Loader } from '../../../components/common';
import { VendorIncomingOrderDetail } from '../components/VendorIncomingOrderDetail';
import { VendorStartPickingAction } from '../components/VendorStartPickingAction';
import { useVendorOrderDetail } from '../hooks/useVendorOrderDetail';
import { useVendorOrderRoom } from '../../realtime-store-operations/hooks/useVendorOrderRoom';
import { useVendorRealtimeStore } from '../../realtime-store-operations/store/vendor-realtime.store';
import { applyVendorRealtimeOrderEventToDetail } from '../../realtime-store-operations/utils/vendor-realtime-order-list.util';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorIncomingOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, error, isLoading, refetch } = useVendorOrderDetail(orderId);
  const lastOrderEvent = useVendorRealtimeStore((state) => state.lastOrderEvent);
  useVendorOrderRoom(orderId);

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

  const order = applyVendorRealtimeOrderEventToDetail(data, lastOrderEvent);

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <Link to="/orders">Back to incoming orders</Link>
      <VendorIncomingOrderDetail order={order} />
      <VendorStartPickingAction order={order} />
    </section>
  );
}
