import { Card, Badge } from '../../../components/common';
import { useVendorRealtimeStore } from '../../realtime-store-operations/store/vendor-realtime.store';
import { getVendorRealtimePickupStatusForOrder } from '../../realtime-store-operations/utils/vendor-realtime-pickup-status.util';
import { useVendorOrderDeliveryStatus } from '../hooks/useVendorOrderDeliveryStatus';
import type { VendorOrderDetail } from '../types/vendor-orders.types';

export function VendorPickupVisibilityCard({ order }: { order: VendorOrderDetail }) {
  const { data: delivery, isLoading, error } = useVendorOrderDeliveryStatus(order.orderId);
  const lastPickupEvent = useVendorRealtimeStore((state) => state.lastPickupEvent);
  const realtimePickupStatus = getVendorRealtimePickupStatusForOrder(
    lastPickupEvent,
    order.orderId,
  );
  const hasRealtimePickupStatus = Boolean(realtimePickupStatus);

  // We only show pickup visibility for active/preparing orders or if an assignment exists
  const showCard = 
    order.orderStatus === 'ready_for_pickup' || 
    order.orderStatus === 'packing' || 
    order.orderStatus === 'picking' ||
    order.orderStatus === 'accepted' ||
    Boolean(delivery) ||
    hasRealtimePickupStatus;

  if (!showCard) {
    return null;
  }

  if (isLoading) {
    return (
      <Card title="Live Delivery Status">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading tracking details...</p>
      </Card>
    );
  }

  if ((error || !delivery) && !hasRealtimePickupStatus) {
    return (
      <Card title="Live Delivery Status">
        <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Badge variant="warning">Awaiting Rider Match</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            Riders are checking the active dispatches queue. We will assign someone shortly!
          </p>
        </div>
      </Card>
    );
  }

  const currentStatus = realtimePickupStatus ?? delivery?.deliveryStatus ?? 'assigned';

  // Status helper mapping
  const isAssigned = [
    'assigned',
    'en_route_to_store',
    'arrived_at_store',
    'picked_up',
  ].includes(currentStatus);

  const isArrived = [
    'arrived_at_store',
    'picked_up',
  ].includes(currentStatus);

  const isPickedUp = currentStatus === 'picked_up';

  const getStatusBadge = () => {
    if (currentStatus === 'picked_up') return <Badge variant="success">Handover Completed</Badge>;
    if (currentStatus === 'arrived_at_store') return <Badge variant="success">Arrived at Store</Badge>;
    if (currentStatus === 'en_route_to_store') return <Badge variant="info">Incoming Rider</Badge>;
    if (currentStatus === 'assigned') return <Badge variant="info">Rider Assigned</Badge>;
    return <Badge variant="warning">Awaiting Rider</Badge>;
  };

  return (
    <Card title="Live Delivery Tracking (Pickup Phase)">
      <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
        
        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          {getStatusBadge()}
        </div>

        {/* Stateful Steps Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)', background: 'var(--color-background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <span style={{ fontSize: '1.2rem' }}>{isAssigned ? '✅' : '⚪'}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: isAssigned ? 'bold' : 'normal', color: isAssigned ? 'var(--color-text-primary)' : 'var(--color-text-disabled)' }}>
                Rider Assigned
              </span>
              <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                Rider matched and moving to store.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <span style={{ fontSize: '1.2rem' }}>{isArrived ? '✅' : '⚪'}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: isArrived ? 'bold' : 'normal', color: isArrived ? 'var(--color-text-primary)' : 'var(--color-text-disabled)' }}>
                Arrived at Store
              </span>
              <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                Rider is at the merchant parking bay. Prepare handover!
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <span style={{ fontSize: '1.2rem' }}>{isPickedUp ? '✅' : '⚪'}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: isPickedUp ? 'bold' : 'normal', color: isPickedUp ? 'var(--color-text-primary)' : 'var(--color-text-disabled)' }}>
                Handover Completed
              </span>
              <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                Rider picked up order and is en route to customer doorstep.
              </span>
            </div>
          </div>

        </div>

        {/* Assigned Rider details */}
        {delivery?.riderProfile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#7c3aed' }}>
                {delivery.riderProfile.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>{delivery.riderProfile.name}</span>
                <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                  {delivery.riderProfile.vehicleType.toUpperCase()} • {delivery.riderProfile.vehicleNumber ?? 'No registration number'}
                </span>
              </div>
            </div>
            
            <a 
              href={`tel:${delivery.riderProfile.phone}`}
              style={{
                textDecoration: 'none',
                background: 'var(--color-primary)',
                color: '#ffffff',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 'bold',
                fontSize: 'var(--font-size-small)'
              }}
            >
              📞 Call Rider
            </a>
          </div>
        )}

      </div>
    </Card>
  );
}
