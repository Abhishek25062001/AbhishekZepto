import { Link } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import type { VendorOrderListItem } from '../types/vendor-orders.types';
import { VendorOrderSlaBadge } from './VendorOrderSlaBadge';
import { VendorOrderStatusBadge } from './VendorOrderStatusBadge';

type ActiveOrderRow = VendorOrderListItem & Record<string, unknown>;

const formatDateTime = (value: string | null) => (value ? new Date(value).toLocaleString() : 'Not set');

const columns: TableColumn<ActiveOrderRow>[] = [
  {
    header: 'Order',
    key: 'orderNumber',
    render: (row) => <Link to={`/orders/active/${row.orderId}`}>{row.orderNumber}</Link>,
  },
  {
    header: 'Order status',
    key: 'orderStatus',
    render: (row) => <VendorOrderStatusBadge status={row.orderStatus} />,
  },
  { header: 'Picker', key: 'pickerStatus', render: (row) => row.pickerStatus ?? 'Not started' },
  { header: 'Packing', key: 'packingStatus', render: (row) => row.packingStatus ?? 'Not started' },
  { header: 'Items', key: 'itemCount' },
  {
    header: 'Total',
    key: 'grandTotal',
    render: (row) => `${row.currency} ${row.grandTotal.toFixed(2)}`,
  },
  { header: 'Accepted', key: 'acceptedAt', render: (row) => formatDateTime(row.acceptedAt ?? row.placedAt) },
  { header: 'SLA', key: 'slaStatus', render: (row) => <VendorOrderSlaBadge slaStatus={row.slaStatus} /> },
];

export function VendorActiveOrdersTable({
  isFetching = false,
  orders,
}: {
  isFetching?: boolean;
  orders: VendorOrderListItem[];
}) {
  const rows = orders.map((order) => ({ ...order } as ActiveOrderRow));
  return (
    <Table
      columns={columns}
      data={rows}
      emptyMessage="No active orders."
      loading={isFetching && rows.length === 0}
      rowKey="orderId"
    />
  );
}
