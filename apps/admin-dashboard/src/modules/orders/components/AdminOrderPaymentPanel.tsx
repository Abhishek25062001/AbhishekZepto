import type { AdminOrderDetail } from '../types/admin-orders.types';
import {
  ADMIN_ORDER_PAYMENT_STATUS_LABELS,
  formatAdminOrderMoney,
} from '../utils/admin-orders-display.util';

type AdminOrderPaymentPanelProps = {
  order: AdminOrderDetail;
};

export function AdminOrderPaymentPanel({ order }: AdminOrderPaymentPanelProps) {
  return (
    <section>
      <h2>Payment</h2>
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <PaymentItem label="Payment ID" value={order.paymentId} />
        <PaymentItem label="Status" value={ADMIN_ORDER_PAYMENT_STATUS_LABELS[order.paymentStatus]} />
        <PaymentItem label="Subtotal" value={formatAdminOrderMoney(order.subtotal, order.currency)} />
        <PaymentItem label="Tax" value={formatAdminOrderMoney(order.taxAmount, order.currency)} />
        <PaymentItem label="Delivery fee" value={formatAdminOrderMoney(order.deliveryFeeAmount, order.currency)} />
        <PaymentItem label="Discount" value={formatAdminOrderMoney(order.discountAmount, order.currency)} />
      </dl>
    </section>
  );
}

function PaymentItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: 'var(--color-text-secondary)' }}>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}
