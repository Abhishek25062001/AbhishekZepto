import { Link, useParams } from 'react-router-dom';

import { ErrorView, Loader } from '../../../components/common';
import { VendorCompletePickingAction } from '../components/VendorCompletePickingAction';
import { VendorIncomingOrderDetail } from '../components/VendorIncomingOrderDetail';
import { VendorPackingActions } from '../components/VendorPackingActions';
import { VendorPickingItemsTable } from '../components/VendorPickingItemsTable';
import { VendorStartPickingAction } from '../components/VendorStartPickingAction';
import { VendorPickupVisibilityCard } from '../components/VendorPickupVisibilityCard';
import { useVendorOrderDetail } from '../hooks/useVendorOrderDetail';
import { RiderArrivedAlert } from '../../realtime-store-operations/components/RiderArrivedAlert';
import { PickupCompletedAlert } from '../../realtime-store-operations/components/PickupCompletedAlert';
import { useVendorOrderRoom } from '../../realtime-store-operations/hooks/useVendorOrderRoom';
import { useVendorRealtimeStore } from '../../realtime-store-operations/store/vendor-realtime.store';
import { applyVendorRealtimeOrderEventToDetail } from '../../realtime-store-operations/utils/vendor-realtime-order-list.util';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorActiveOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, error, isLoading, refetch } = useVendorOrderDetail(orderId);
  const lastOrderEvent = useVendorRealtimeStore((state) => state.lastOrderEvent);
  useVendorOrderRoom(orderId);

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

  const order = applyVendorRealtimeOrderEventToDetail(data, lastOrderEvent);

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <Link to="/orders/active">Back to active orders</Link>
      <RiderArrivedAlert />
      <PickupCompletedAlert />
      <VendorIncomingOrderDetail order={order} />
      <VendorPickupVisibilityCard order={order} />
      <VendorPickingItemsTable order={order} />
      <VendorStartPickingAction order={order} />
      <VendorCompletePickingAction order={order} />
      <VendorPackingActions order={order} />
    </section>
  );
}
