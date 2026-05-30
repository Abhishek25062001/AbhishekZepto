import { Link } from 'react-router-dom';

import { Badge, Table, type TableColumn } from '../../../components/common';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import type { AdminLiveOrder } from '../types/control-tower-realtime.types';
import { applyAdminRealtimeOrderEventToList } from '../utils/live-orders.util';

const formatDateTime = (value: string): string => new Date(value).toLocaleString();

const columns: TableColumn<Record<string, unknown>>[] = [
  {
    header: 'Order ID',
    key: 'orderId',
    render: (row) => <code>{String(row['orderId']).slice(-8)}</code>,
  },
  { header: 'Customer', key: 'customerId' },
  { header: 'Store', key: 'storeId' },
  {
    header: 'Status',
    key: 'orderStatus',
    render: (row) => <Badge variant="info">{String(row['orderStatus'])}</Badge>,
  },
  {
    header: 'Payment',
    key: 'paymentStatus',
    render: (row) => <Badge variant="success">{String(row['paymentStatus'])}</Badge>,
  },
  {
    header: 'Updated At',
    key: 'updatedAt',
    render: (row) => formatDateTime(String(row['updatedAt'])),
  },
  {
    header: 'Actions',
    key: 'orderId',
    render: (row) => <Link to={`/orders/${String(row['orderId'])}`}>View</Link>,
  },
];

type LiveOrdersTableProps = {
  orders: AdminLiveOrder[];
  loading?: boolean;
  shouldIncludeOrder?: (order: AdminLiveOrder) => boolean;
};

export function LiveOrdersTable({
  loading = false,
  orders,
  shouldIncludeOrder,
}: LiveOrdersTableProps) {
  const lastOrderEvent = useAdminRealtimeStore((state) => state.lastOrderEvent);
  const liveOrders = applyAdminRealtimeOrderEventToList(
    orders,
    lastOrderEvent,
    shouldIncludeOrder,
  );

  return (
    <Table
      columns={columns}
      data={liveOrders as unknown as Record<string, unknown>[]}
      emptyMessage={loading ? 'Loading live orders...' : 'No live orders found.'}
      rowKey="orderId"
    />
  );
}
