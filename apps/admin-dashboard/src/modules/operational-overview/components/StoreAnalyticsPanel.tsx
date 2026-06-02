import { ErrorView } from '../../../components/common/ErrorView';
import { useStoreAnalytics } from '../hooks/useOperationalOverview';
import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';
import { BreakdownList } from './BreakdownList';

export function StoreAnalyticsPanel({ filters }: { filters: OperationalAnalyticsFilters }) {
  const { data, error, isLoading, refetch } = useStoreAnalytics(filters);

  if (isLoading) return <p>Loading store analytics...</p>;
  if (error) {
    return <ErrorView message="Store analytics could not be loaded." onRetry={() => void refetch()} />;
  }

  return <BreakdownList breakdown={data?.stores.byStatus ?? {}} title="Store Status" />;
}
