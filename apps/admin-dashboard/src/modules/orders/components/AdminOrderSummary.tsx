import type { AdminOrderDetail } from '../types/admin-orders.types';
import {
  ADMIN_ORDER_PAYMENT_STATUS_LABELS,
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STORE_STATUS_LABELS,
  formatAdminOrderDate,
  formatAdminOrderMoney,
} from '../utils/admin-orders-display.util';

type AdminOrderSummaryProps = {
  order: AdminOrderDetail;
};

export function AdminOrderSummary({ order }: AdminOrderSummaryProps) {
  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
      <h2>Summary</h2>
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <SummaryItem label="Order" value={order.orderNumber} />
        <SummaryItem label="Customer" value={order.customerId} />
        <SummaryItem label="Store" value={order.storeId} />
        <SummaryItem label="City" value={order.cityId ?? order.addressSnapshot.city} />
        <SummaryItem label="Status" value={ADMIN_ORDER_STATUS_LABELS[order.orderStatus]} />
        <SummaryItem label="Store status" value={ADMIN_ORDER_STORE_STATUS_LABELS[order.storeStatus]} />
        <SummaryItem label="Payment" value={ADMIN_ORDER_PAYMENT_STATUS_LABELS[order.paymentStatus]} />
        <SummaryItem label="Total" value={formatAdminOrderMoney(order.grandTotal, order.currency)} />
        <SummaryItem label="Created" value={formatAdminOrderDate(order.createdAt)} />
        <SummaryItem label="Accepted" value={formatAdminOrderDate(order.acceptedAt)} />
      </dl>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: 'var(--color-text-secondary)' }}>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}
