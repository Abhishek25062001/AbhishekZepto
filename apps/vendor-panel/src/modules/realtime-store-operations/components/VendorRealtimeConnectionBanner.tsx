import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import { getVendorRealtimeConnectionBannerMessage } from '../utils/vendor-realtime-connection-banner.util';

export function VendorRealtimeConnectionBanner() {
  const connectionState = useVendorRealtimeStore((state) => state.connectionState);
  const connectionError = useVendorRealtimeStore((state) => state.connectionError);

  const message = getVendorRealtimeConnectionBannerMessage(
    connectionState,
    connectionError,
  );

  if (!message) {
    return null;
  }

  const isFailure = connectionState === 'failed';

  return (
    <div
      role="status"
      style={{
        background: isFailure ? '#fef2f2' : '#fffbeb',
        border: `1px solid ${isFailure ? '#fecaca' : '#fde68a'}`,
        borderRadius: 'var(--radius-sm)',
        color: isFailure ? '#991b1b' : '#92400e',
        fontSize: 'var(--font-size-small)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
      }}
    >
      {message}
    </div>
  );
}
