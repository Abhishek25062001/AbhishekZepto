import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  formatVendorOrderRefundReview,
  getVendorOrderCancellationReason,
} from '../utils/vendor-orders-display.util';
import { VendorIncomingOrderItemsTable } from './VendorIncomingOrderItemsTable';
import { VendorOrderStatusBadge, VendorStoreStatusBadge } from './VendorOrderStatusBadge';
import { VendorOrderTimeline } from './VendorOrderTimeline';

const formatDateTime = (value: string | null) => (value ? new Date(value).toLocaleString() : 'Not set');

export function VendorOrderHistoryDetail({ order }: { order: VendorOrderDetail }) {
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
            <dt>Placed</dt>
            <dd>{formatDateTime(order.placedAt)}</dd>
          </div>
          <div>
            <dt>Accepted</dt>
            <dd>{formatDateTime(order.acceptedAt)}</dd>
          </div>
          <div>
            <dt>Ready for pickup</dt>
            <dd>{formatDateTime(order.readyForPickupAt)}</dd>
          </div>
        </dl>
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Items</h2>
        <VendorIncomingOrderItemsTable items={order.items} />
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Totals</h2>
        <dl style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <div>
            <dt>Subtotal</dt>
            <dd>{order.currency} {order.subtotal.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>{order.currency} {order.taxAmount.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Delivery fee</dt>
            <dd>{order.currency} {order.deliveryFeeAmount.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Discount</dt>
            <dd>{order.currency} {order.discountAmount.toFixed(2)}</dd>
          </div>
        </dl>
      </section>

      {order.cancelledAt || order.cancellationReason || order.rejectionReason ? (
        <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          <h2>Cancellation</h2>
          <dl style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <div>
              <dt>Cancelled</dt>
              <dd>{formatDateTime(order.cancelledAt)}</dd>
            </div>
            <div>
              <dt>Reason</dt>
              <dd>{getVendorOrderCancellationReason(order)}</dd>
            </div>
            <div>
              <dt>Refund review</dt>
              <dd>{formatVendorOrderRefundReview(order.refundReviewRequired)}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Timeline</h2>
        <VendorOrderTimeline timeline={order.timeline} />
      </section>
    </section>
  );
}
