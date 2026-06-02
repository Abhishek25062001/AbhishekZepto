import { ErrorView } from '../../../components/common/ErrorView';
import { useOrderAnalytics } from '../hooks/useOperationalOverview';
import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';
import { BreakdownList } from './BreakdownList';

export function OrderAnalyticsPanel({ filters }: { filters: OperationalAnalyticsFilters }) {
  const { data, error, isLoading, refetch } = useOrderAnalytics(filters);

  if (isLoading) return <p>Loading order analytics...</p>;
  if (error) {
    return <ErrorView message="Order analytics could not be loaded." onRetry={() => void refetch()} />;
  }

  return <BreakdownList breakdown={data?.orders.byStatus ?? {}} title="Order Status" />;
}
