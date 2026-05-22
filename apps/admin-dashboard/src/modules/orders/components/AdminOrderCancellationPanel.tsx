import type { AdminOrderDetail } from '../types/admin-orders.types';
import {
  formatAdminOrderDate,
  formatAdminOrderRefundReview,
  getAdminOrderCancellationReason,
} from '../utils/admin-orders-display.util';

type AdminOrderCancellationPanelProps = {
  order: AdminOrderDetail;
};

export function AdminOrderCancellationPanel({ order }: AdminOrderCancellationPanelProps) {
  return (
    <section>
      <h2>Cancellation</h2>
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <CancellationItem label="Reason" value={getAdminOrderCancellationReason(order)} />
        <CancellationItem label="Cancelled at" value={formatAdminOrderDate(order.cancelledAt)} />
        <CancellationItem label="Actor" value={order.cancelledBy?.actorType ?? 'Not available'} />
        <CancellationItem label="Refund" value={formatAdminOrderRefundReview(order)} />
      </dl>
    </section>
  );
}

function CancellationItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: 'var(--color-text-secondary)' }}>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}
