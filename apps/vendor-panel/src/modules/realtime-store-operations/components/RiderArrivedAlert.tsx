import { useNavigate } from 'react-router-dom';

import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import { getRiderArrivedAlertViewModel } from '../utils/vendor-realtime-alert.util';

export function RiderArrivedAlert() {
  const navigate = useNavigate();
  const lastPickupEvent = useVendorRealtimeStore((state) => state.lastPickupEvent);
  const viewModel = getRiderArrivedAlertViewModel(lastPickupEvent);

  if (!viewModel) {
    return null;
  }

  return (
    <div
      style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
        <div>
          <strong>Rider arrived for pickup</strong>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            Order {viewModel.orderId} • Assignment {viewModel.assignmentId} • Rider{' '}
            {viewModel.riderId} • {viewModel.arrivedTimeLabel}
          </div>
        </div>
        <button
          onClick={() => navigate(viewModel.targetPath)}
          style={{
            alignSelf: 'center',
            background: 'var(--color-primary)',
            border: 0,
            borderRadius: 'var(--radius-sm)',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: 700,
            padding: 'var(--spacing-xs) var(--spacing-sm)',
          }}
          type="button"
        >
          Open pickup
        </button>
      </div>
    </div>
  );
}
