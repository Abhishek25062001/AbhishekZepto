import type { AdminOrderDetail } from '../types/admin-orders.types';

type AdminOrderSlaPanelProps = {
  order: AdminOrderDetail;
};

export function AdminOrderSlaPanel({ order }: AdminOrderSlaPanelProps) {
  return (
    <section>
      <h2>SLA</h2>
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Status</dt>
          <dd style={{ margin: 0 }}>{order.slaStatus ?? 'Not available'}</dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Breached stage</dt>
          <dd style={{ margin: 0 }}>{order.slaBreachedStage ?? 'Not available'}</dd>
        </div>
      </dl>
    </section>
  );
}
