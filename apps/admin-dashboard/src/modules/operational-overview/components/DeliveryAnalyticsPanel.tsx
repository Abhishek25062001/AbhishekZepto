import { ErrorView } from '../../../components/common/ErrorView';
import { useDeliveryAnalytics } from '../hooks/useOperationalOverview';
import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';
import { BreakdownList } from './BreakdownList';

export function DeliveryAnalyticsPanel({ filters }: { filters: OperationalAnalyticsFilters }) {
  const { data, error, isLoading, refetch } = useDeliveryAnalytics(filters);

  if (isLoading) return <p>Loading delivery analytics...</p>;
  if (error) {
    return <ErrorView message="Delivery analytics could not be loaded." onRetry={() => void refetch()} />;
  }

  return <BreakdownList breakdown={data?.delivery.byStatus ?? {}} title="Delivery Status" />;
}
