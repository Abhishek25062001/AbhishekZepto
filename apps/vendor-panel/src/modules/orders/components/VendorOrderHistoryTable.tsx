import { Link } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import type { VendorOrderListItem } from '../types/vendor-orders.types';
import { VendorOrderStatusBadge, VendorStoreStatusBadge } from './VendorOrderStatusBadge';

type HistoryOrderRow = VendorOrderListItem & Record<string, unknown>;

const formatDateTime = (value: string | null) => (value ? new Date(value).toLocaleString() : 'Not set');

const columns: TableColumn<HistoryOrderRow>[] = [
  {
    header: 'Order',
    key: 'orderNumber',
    render: (row) => <Link to={`/orders/history/${row.orderId}`}>{row.orderNumber}</Link>,
  },
  {
    header: 'Order status',
    key: 'orderStatus',
    render: (row) => <VendorOrderStatusBadge status={row.orderStatus} />,
  },
  {
    header: 'Store status',
    key: 'storeStatus',
    render: (row) => <VendorStoreStatusBadge status={row.storeStatus} />,
  },
  { header: 'Payment', key: 'paymentStatus' },
  {
    header: 'Total',
    key: 'grandTotal',
    render: (row) => `${row.currency} ${row.grandTotal.toFixed(2)}`,
  },
  { header: 'Placed', key: 'placedAt', render: (row) => formatDateTime(row.placedAt) },
  { header: 'Activity', key: 'acceptedAt', render: (row) => formatDateTime(row.acceptedAt ?? row.createdAt) },
];

export function VendorOrderHistoryTable({
  isFetching = false,
  orders,
}: {
  isFetching?: boolean;
  orders: VendorOrderListItem[];
}) {
  const rows = orders.map((order) => ({ ...order } as HistoryOrderRow));
  return (
    <Table
      columns={columns}
      data={rows}
      emptyMessage="No order history."
      loading={isFetching && rows.length === 0}
      rowKey="orderId"
    />
  );
}
