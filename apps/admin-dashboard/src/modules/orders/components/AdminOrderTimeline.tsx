import type { AdminOrderTimelineEvent } from '../types/admin-orders.types';
import { formatAdminOrderDate } from '../utils/admin-orders-display.util';

type AdminOrderTimelineProps = {
  timeline: AdminOrderTimelineEvent[];
};

export function AdminOrderTimeline({ timeline }: AdminOrderTimelineProps) {
  return (
    <section>
      <h2>Timeline</h2>
      {timeline.length === 0 ? <p>No timeline events recorded.</p> : null}
      <ol style={{ display: 'grid', gap: 'var(--spacing-sm)', paddingLeft: 'var(--spacing-lg)' }}>
        {timeline.map((event, index) => (
          <li key={`${event.event}-${event.createdAt}-${index}`}>
            <strong>{event.event}</strong>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              {formatAdminOrderDate(event.createdAt)} · {event.actorType}
              {event.actorRole ? ` · ${event.actorRole}` : ''}
            </div>
            <div>
              {event.fromStatus ?? 'none'} to {event.toStatus ?? 'none'}
              {event.reason ? ` · ${event.reason}` : ''}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
