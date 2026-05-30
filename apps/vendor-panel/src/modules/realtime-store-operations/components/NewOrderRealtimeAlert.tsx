import { useNavigate } from 'react-router-dom';

import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import { getNewOrderRealtimeAlertViewModel } from '../utils/vendor-realtime-alert.util';

export function NewOrderRealtimeAlert() {
  const navigate = useNavigate();
  const lastOrderEvent = useVendorRealtimeStore((state) => state.lastOrderEvent);
  const viewModel = getNewOrderRealtimeAlertViewModel(lastOrderEvent);

  if (!viewModel) {
    return null;
  }

  return (
    <div
      style={{
        background: '#ecfdf5',
        border: '1px solid #bbf7d0',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
        <div>
          <strong>New order received</strong>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            Order {viewModel.orderId} • {viewModel.itemCountLabel} •{' '}
            {viewModel.totalAmountLabel} • {viewModel.createdTimeLabel}
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
          Open
        </button>
      </div>
    </div>
  );
}
