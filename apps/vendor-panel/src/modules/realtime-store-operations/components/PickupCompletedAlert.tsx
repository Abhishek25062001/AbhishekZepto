import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import { VENDOR_REALTIME_EVENTS } from '../types/vendor-realtime.types';

const formatTime = (timestamp: string | null): string =>
  timestamp ? new Date(timestamp).toLocaleTimeString() : 'Completion time pending';

export function PickupCompletedAlert() {
  const lastPickupEvent = useVendorRealtimeStore((state) => state.lastPickupEvent);

  if (
    !lastPickupEvent ||
    lastPickupEvent.eventName !== VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED
  ) {
    return null;
  }

  return (
    <div
      role="status"
      style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
      }}
    >
      <strong>Pickup completed</strong>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
        Order {lastPickupEvent.orderId} • Rider {lastPickupEvent.riderId} •{' '}
        {formatTime(lastPickupEvent.pickupCompletedAt)}
      </div>
    </div>
  );
}

