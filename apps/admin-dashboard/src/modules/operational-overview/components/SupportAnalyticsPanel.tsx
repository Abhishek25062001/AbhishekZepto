import { ErrorView } from '../../../components/common/ErrorView';
import { useSupportAnalytics } from '../hooks/useOperationalOverview';
import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';
import { BreakdownList } from './BreakdownList';

export function SupportAnalyticsPanel({ filters }: { filters: OperationalAnalyticsFilters }) {
  const { data, error, isLoading, refetch } = useSupportAnalytics(filters);

  if (isLoading) return <p>Loading support analytics...</p>;
  if (error) {
    return <ErrorView message="Support analytics could not be loaded." onRetry={() => void refetch()} />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      <BreakdownList breakdown={data?.support.byStatus ?? {}} title="Support Status" />
      <BreakdownList breakdown={data?.support.byPriority ?? {}} title="Support Priority" />
      <BreakdownList breakdown={data?.support.byCategory ?? {}} title="Support Category" />
    </div>
  );
}
