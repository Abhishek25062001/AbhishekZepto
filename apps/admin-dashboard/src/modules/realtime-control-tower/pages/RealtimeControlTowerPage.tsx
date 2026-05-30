import { useMemo, useState } from 'react';

import { Button, Card, Input } from '../../../components/common';
import { PageContainer } from '../../../components/layout';
import { AdminRealtimeConnectionBanner } from '../components/AdminRealtimeConnectionBanner';
import { ControlTowerMetricCards } from '../components/ControlTowerMetricCards';
import { LiveDeliveryMapPlaceholder } from '../components/LiveDeliveryMapPlaceholder';
import { LiveOrdersTable } from '../components/LiveOrdersTable';
import { LiveSlaBreachPanel } from '../components/LiveSlaBreachPanel';
import { useAdminCityRoom } from '../hooks/useAdminCityRoom';
import { useControlTowerSnapshot } from '../hooks/useControlTowerSnapshot';
import type { AdminLiveOrder } from '../types/control-tower-realtime.types';

export function RealtimeControlTowerPage() {
  const [cityId, setCityId] = useState('');
  const activeCityId = cityId.trim();
  const snapshotQuery = useMemo(
    () => (activeCityId ? { cityId: activeCityId } : {}),
    [activeCityId],
  );
  const {
    data: snapshot,
    isFetching,
    isLoading,
    refetch,
  } = useControlTowerSnapshot(snapshotQuery);

  useAdminCityRoom(activeCityId);

  const shouldIncludeOrder = (order: AdminLiveOrder): boolean =>
    activeCityId ? order.cityId === activeCityId : true;

  return (
    <PageContainer title="Realtime Control Tower">
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <AdminRealtimeConnectionBanner />

        <Card>
          <div
            style={{
              alignItems: 'end',
              display: 'grid',
              gap: 'var(--spacing-md)',
              gridTemplateColumns: 'minmax(220px, 1fr) auto',
            }}
          >
            <Input
              label="City ID"
              onChange={(event) => setCityId(event.target.value)}
              placeholder="Filter live operations by city"
              value={cityId}
            />
            <Button loading={isFetching && !isLoading} onClick={() => void refetch()}>
              Refresh
            </Button>
          </div>
        </Card>

        <ControlTowerMetricCards metrics={snapshot} />

        <section
          style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          }}
        >
          <Card title="Live Orders">
            <LiveOrdersTable
              loading={isLoading}
              orders={snapshot?.activeOrders ?? []}
              shouldIncludeOrder={shouldIncludeOrder}
            />
          </Card>

          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            <LiveDeliveryMapPlaceholder deliveries={snapshot?.activeDeliveries ?? []} />
            <LiveSlaBreachPanel breaches={snapshot?.openSlaBreaches ?? []} />
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
