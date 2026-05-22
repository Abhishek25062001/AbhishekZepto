import type { AdminOrderDetail } from '../types/admin-orders.types';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STORE_STATUS_LABELS,
} from '../utils/admin-orders-display.util';

type AdminOrderStatePanelProps = {
  order: AdminOrderDetail;
};

export function AdminOrderStatePanel({ order }: AdminOrderStatePanelProps) {
  return (
    <section>
      <h2>State</h2>
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <StateItem label="Order status" value={ADMIN_ORDER_STATUS_LABELS[order.orderStatus]} />
        <StateItem label="Store status" value={ADMIN_ORDER_STORE_STATUS_LABELS[order.storeStatus]} />
        <StateItem label="Picker status" value={order.pickerStatus ?? 'Not started'} />
        <StateItem label="Packing status" value={order.packingStatus ?? 'Not started'} />
        <StateItem label="Ready for pickup" value={order.readyForPickupAt ?? 'Not ready'} />
      </dl>
    </section>
  );
}

function StateItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: 'var(--color-text-secondary)' }}>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}
