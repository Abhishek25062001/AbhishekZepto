import { Card } from '../../../components/common/Card';
import type { OperationalOverviewResponse, StatusAnalyticsMetric, SupportAnalyticsMetric } from '../types/operational-overview.types';

type MetricCard = {
  label: string;
  metric: StatusAnalyticsMetric | SupportAnalyticsMetric;
};

const topBreakdown = (metric: StatusAnalyticsMetric | SupportAnalyticsMetric) => {
  const entries = Object.entries(metric.byStatus ?? {});
  if (entries.length === 0) return 'No status activity';

  const topEntry = entries.sort(([, left], [, right]) => right - left)[0];
  if (!topEntry) return 'No status activity';

  const [status, count] = topEntry;
  return `${status}: ${count}`;
};

export function OperationalMetricGrid({ overview }: { overview: OperationalOverviewResponse }) {
  const cards: MetricCard[] = [
    { label: 'Orders', metric: overview.orders },
    { label: 'Delivery', metric: overview.delivery },
    { label: 'Stores', metric: overview.stores },
    { label: 'Support', metric: overview.support },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      {cards.map((card) => (
        <Card key={card.label} title={card.label}>
          <strong style={{ display: 'block', fontSize: '2rem' }}>{card.metric.total}</strong>
          <span style={{ color: 'var(--color-text-secondary)' }}>{topBreakdown(card.metric)}</span>
        </Card>
      ))}
    </div>
  );
}
