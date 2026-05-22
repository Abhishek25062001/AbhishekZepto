import type { VendorOrderDetail } from '../types/vendor-orders.types';
import { VendorOrderSlaBadge } from './VendorOrderSlaBadge';
import { VendorOrderStatusBadge, VendorStoreStatusBadge } from './VendorOrderStatusBadge';
import { VendorIncomingOrderActions } from './VendorIncomingOrderActions';
import { VendorIncomingOrderItemsTable } from './VendorIncomingOrderItemsTable';

const formatDateTime = (value: string | null) => (value ? new Date(value).toLocaleString() : 'Not set');

export function VendorIncomingOrderDetail({ order }: { order: VendorOrderDetail }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>{order.orderNumber}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {order.currency} {order.grandTotal.toFixed(2)} · {order.itemCount} items
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Summary</h2>
        <dl style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <div>
            <dt>Order status</dt>
            <dd><VendorOrderStatusBadge status={order.orderStatus} /></dd>
          </div>
          <div>
            <dt>Store status</dt>
            <dd><VendorStoreStatusBadge status={order.storeStatus} /></dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{order.paymentStatus}</dd>
          </div>
          <div>
            <dt>SLA</dt>
            <dd><VendorOrderSlaBadge slaStatus={order.slaStatus} /></dd>
          </div>
          <div>
            <dt>Placed</dt>
            <dd>{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt>Accepted</dt>
            <dd>{formatDateTime(order.acceptedAt)}</dd>
          </div>
        </dl>
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Items</h2>
        <VendorIncomingOrderItemsTable items={order.items} />
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>State</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Picker: {order.pickerStatus ?? 'Not started'} · Packing: {order.packingStatus ?? 'Not started'}
        </p>
      </section>

      <VendorIncomingOrderActions order={order} />
    </section>
  );
}
