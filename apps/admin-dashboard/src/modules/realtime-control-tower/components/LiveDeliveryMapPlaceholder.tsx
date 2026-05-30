import { Badge, Card } from '../../../components/common';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import type { AdminDeliveryLocation } from '../types/control-tower-realtime.types';
import { applyAdminRealtimeDeliveryEventToLocations } from '../utils/live-delivery-locations.util';

const formatCoordinate = (value: number | null): string =>
  value === null ? 'n/a' : value.toFixed(5);

const formatDateTime = (value: string): string => new Date(value).toLocaleString();

type LiveDeliveryMapPlaceholderProps = {
  deliveries: AdminDeliveryLocation[];
};

export function LiveDeliveryMapPlaceholder({
  deliveries,
}: LiveDeliveryMapPlaceholderProps) {
  const lastDeliveryEvent = useAdminRealtimeStore((state) => state.lastDeliveryEvent);
  const liveDeliveries = applyAdminRealtimeDeliveryEventToLocations(
    deliveries,
    lastDeliveryEvent,
  );

  return (
    <Card title="Live Delivery Locations">
      <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        {liveDeliveries.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No active delivery locations available.
          </p>
        ) : (
          liveDeliveries.map((delivery) => (
            <div
              key={delivery.deliveryId}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                display: 'grid',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-md)',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <strong>Delivery {delivery.deliveryId.slice(-8)}</strong>
                <Badge variant="info">{delivery.deliveryStatus}</Badge>
              </div>
              <span>
                Rider {delivery.deliveryAgentId ?? 'unassigned'} · Order{' '}
                {delivery.orderId.slice(-8)}
              </span>
              <span>
                {formatCoordinate(delivery.latitude)},{' '}
                {formatCoordinate(delivery.longitude)}
              </span>
              <small style={{ color: 'var(--color-text-secondary)' }}>
                Last update {formatDateTime(delivery.updatedAt)}
              </small>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
