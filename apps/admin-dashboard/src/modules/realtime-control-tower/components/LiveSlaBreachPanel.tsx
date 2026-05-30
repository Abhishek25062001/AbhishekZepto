import { Badge, Card } from '../../../components/common';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import type { AdminSlaRealtimeEvent } from '../types/control-tower-realtime.types';
import { applyAdminRealtimeSlaEventToList } from '../utils/live-sla-breaches.util';

const formatDateTime = (value: string): string => new Date(value).toLocaleString();

type LiveSlaBreachPanelProps = {
  breaches: AdminSlaRealtimeEvent[];
};

export function LiveSlaBreachPanel({ breaches }: LiveSlaBreachPanelProps) {
  const lastSlaEvent = useAdminRealtimeStore((state) => state.lastSlaEvent);
  const liveBreaches = applyAdminRealtimeSlaEventToList(breaches, lastSlaEvent);

  return (
    <Card title="Live SLA Breaches">
      <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        {liveBreaches.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No open SLA breaches.
          </p>
        ) : (
          liveBreaches.map((breach) => (
            <div
              key={breach.breachId}
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
                <strong>{breach.breachType}</strong>
                <Badge variant="error">
                  {breach.escalationLevel ?? 'open'}
                </Badge>
              </div>
              <span>
                Order {breach.orderId.slice(-8)} · Assignment{' '}
                {breach.assignmentId?.slice(-8) ?? 'n/a'}
              </span>
              <small style={{ color: 'var(--color-text-secondary)' }}>
                Breached {formatDateTime(breach.breachedAt)}
              </small>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
