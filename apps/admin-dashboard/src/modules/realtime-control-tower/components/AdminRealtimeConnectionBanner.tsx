import { Badge, Card } from '../../../components/common';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import { getAdminRealtimeConnectionBannerMessage } from '../utils/admin-realtime-connection-banner.util';

export function AdminRealtimeConnectionBanner() {
  const connectionError = useAdminRealtimeStore((state) => state.connectionError);
  const connectionState = useAdminRealtimeStore((state) => state.connectionState);
  const message = getAdminRealtimeConnectionBannerMessage(
    connectionState,
    connectionError,
  );

  if (!message) {
    return null;
  }

  return (
    <Card>
      <div style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <Badge variant={connectionState === 'failed' ? 'error' : 'warning'}>
          Live
        </Badge>
        <span>{message}</span>
      </div>
    </Card>
  );
}
