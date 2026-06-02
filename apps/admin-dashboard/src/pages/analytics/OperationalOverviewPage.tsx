import { useMemo, useState } from 'react';

import { EmptyState } from '../../components/common/EmptyState';
import { ErrorView } from '../../components/common/ErrorView';
import { PageContainer } from '../../components/layout/PageContainer';
import { AnalyticsFilterBar } from '../../modules/operational-overview/components/AnalyticsFilterBar';
import { DeliveryAnalyticsPanel } from '../../modules/operational-overview/components/DeliveryAnalyticsPanel';
import { OperationalMetricGrid } from '../../modules/operational-overview/components/OperationalMetricGrid';
import { OrderAnalyticsPanel } from '../../modules/operational-overview/components/OrderAnalyticsPanel';
import { StoreAnalyticsPanel } from '../../modules/operational-overview/components/StoreAnalyticsPanel';
import { SupportAnalyticsPanel } from '../../modules/operational-overview/components/SupportAnalyticsPanel';
import {
  cleanOperationalAnalyticsFilters,
  OPERATIONAL_ANALYTICS_DEFAULT_FILTERS,
} from '../../modules/operational-overview/hooks/useOperationalAnalyticsFilters';
import { useOperationalOverview } from '../../modules/operational-overview/hooks/useOperationalOverview';
import type { OperationalAnalyticsFilters } from '../../modules/operational-overview/types/operational-overview.types';

export function OperationalOverviewPage() {
  const [filters, setFilters] = useState<OperationalAnalyticsFilters>(
    OPERATIONAL_ANALYTICS_DEFAULT_FILTERS,
  );
  const queryFilters = useMemo(() => cleanOperationalAnalyticsFilters(filters), [filters]);
  const { data, error, isLoading, refetch } = useOperationalOverview(queryFilters);
  const total = data
    ? data.orders.total + data.delivery.total + data.stores.total + data.support.total
    : 0;

  return (
    <PageContainer title="Operational Overview">
      <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
        <AnalyticsFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(OPERATIONAL_ANALYTICS_DEFAULT_FILTERS)}
        />
        {isLoading ? <p>Loading operational overview...</p> : null}
        {error ? (
          <ErrorView
            message="Operational analytics could not be loaded."
            onRetry={() => void refetch()}
            title="Analytics unavailable"
          />
        ) : null}
        {data && total === 0 ? (
          <EmptyState
            title="No operational activity"
            description="The selected filters returned zero activity."
          />
        ) : null}
        {data ? <OperationalMetricGrid overview={data} /> : null}
        <div
          style={{
            display: 'grid',
            gap: 'var(--spacing-md)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <OrderAnalyticsPanel filters={queryFilters} />
          <DeliveryAnalyticsPanel filters={queryFilters} />
          <StoreAnalyticsPanel filters={queryFilters} />
        </div>
        <SupportAnalyticsPanel filters={queryFilters} />
      </div>
    </PageContainer>
  );
}
