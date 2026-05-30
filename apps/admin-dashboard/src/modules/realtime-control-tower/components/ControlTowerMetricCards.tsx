import { Card } from '../../../components/common';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import type { AdminControlTowerMetricSnapshot } from '../types/control-tower-realtime.types';
import {
  applyAdminRealtimeEventsToMetrics,
  EMPTY_CONTROL_TOWER_METRICS,
} from '../utils/control-tower-metrics.util';

const METRIC_LABELS: Array<{
  key: keyof AdminControlTowerMetricSnapshot;
  label: string;
}> = [
  { key: 'activeOrdersCount', label: 'Active Orders' },
  { key: 'assignedRidersCount', label: 'Assigned Riders' },
  { key: 'outForDeliveryCount', label: 'Out For Delivery' },
  { key: 'delayedOrdersCount', label: 'Delayed Orders' },
  { key: 'openSlaBreachesCount', label: 'Open SLA Breaches' },
];

type ControlTowerMetricCardsProps = {
  metrics?: AdminControlTowerMetricSnapshot | null;
};

export function ControlTowerMetricCards({ metrics }: ControlTowerMetricCardsProps) {
  const lastDeliveryEvent = useAdminRealtimeStore((state) => state.lastDeliveryEvent);
  const lastOrderEvent = useAdminRealtimeStore((state) => state.lastOrderEvent);
  const lastSlaEvent = useAdminRealtimeStore((state) => state.lastSlaEvent);
  const liveMetrics = applyAdminRealtimeEventsToMetrics(
    metrics ?? EMPTY_CONTROL_TOWER_METRICS,
    lastOrderEvent,
    lastDeliveryEvent,
    lastSlaEvent,
  );

  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      }}
    >
      {METRIC_LABELS.map((metric) => (
        <Card key={metric.key}>
          <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
              {metric.label}
            </span>
            <strong style={{ fontSize: 28 }}>{liveMetrics[metric.key]}</strong>
          </div>
        </Card>
      ))}
    </section>
  );
}
