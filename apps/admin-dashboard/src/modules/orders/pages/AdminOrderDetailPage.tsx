import { Link, useParams } from 'react-router-dom';

import { Loader } from '../../../components/common';
import { AdminOrderCancelAction } from '../components/AdminOrderCancelAction';
import { AdminOrderCancellationPanel } from '../components/AdminOrderCancellationPanel';
import { AdminOrderErrorState } from '../components/AdminOrderErrorState';
import { AdminOrderItemsTable } from '../components/AdminOrderItemsTable';
import { AdminOrderPaymentPanel } from '../components/AdminOrderPaymentPanel';
import { AdminOrderSlaPanel } from '../components/AdminOrderSlaPanel';
import { AdminOrderStatePanel } from '../components/AdminOrderStatePanel';
import { AdminOrderStatusAction } from '../components/AdminOrderStatusAction';
import { AdminOrderSummary } from '../components/AdminOrderSummary';
import { AdminOrderTimeline } from '../components/AdminOrderTimeline';
import { useAdminOrderDetail } from '../hooks/useAdminOrderDetail';
import { useAdminOrderTimeline } from '../hooks/useAdminOrderTimeline';

export function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const detailQuery = useAdminOrderDetail(orderId);
  const timelineQuery = useAdminOrderTimeline(orderId);

  if (detailQuery.isLoading) {
    return <Loader label="Loading order" />;
  }

  if (detailQuery.error || !detailQuery.data) {
    return (
      <>
        <Link to="/orders">Back to orders</Link>
        <AdminOrderErrorState onRetry={() => void detailQuery.refetch()} />
      </>
    );
  }

  const order = detailQuery.data;

  return (
    <>
      <Link to="/orders">Back to orders</Link>
      <h1>{order.orderNumber}</h1>
      <section style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
        <AdminOrderSummary order={order} />
        <AdminOrderStatusAction order={order} />
        <AdminOrderCancelAction order={order} />
        <AdminOrderPaymentPanel order={order} />
        <AdminOrderItemsTable items={order.items} />
        <AdminOrderStatePanel order={order} />
        <AdminOrderSlaPanel order={order} />
        <AdminOrderCancellationPanel order={order} />
        <AdminOrderTimeline timeline={timelineQuery.data ?? order.timeline} />
      </section>
    </>
  );
}
