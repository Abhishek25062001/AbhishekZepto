import { Card } from '../../../components/common/Card';
import type { CountBreakdown } from '../types/operational-overview.types';

type BreakdownListProps = {
  breakdown: CountBreakdown;
  title: string;
};

export function BreakdownList({ breakdown, title }: BreakdownListProps) {
  const entries = Object.entries(breakdown);

  return (
    <Card title={title}>
      {entries.length === 0 ? (
        <p>No activity</p>
      ) : (
        <dl style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          {entries.map(([label, count]) => (
            <div
              key={label}
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <dt>{label}</dt>
              <dd style={{ fontWeight: 700, margin: 0 }}>{count}</dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
}
