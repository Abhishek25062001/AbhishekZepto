import { Link } from 'react-router-dom';
import { Table, type TableColumn } from '../../../components/common';
import type { VendorOrderListItem } from '../types/vendor-orders.types';
import { INCOMING_ORDER_LIST_COLUMNS } from '../utils/vendor-orders-display.util';
import { VendorOrderSlaBadge } from './VendorOrderSlaBadge';
import { VendorOrderStatusBadge, VendorStoreStatusBadge } from './VendorOrderStatusBadge';

export type VendorIncomingOrderRow = VendorOrderListItem & Record<string, unknown>;

const formatDateTime = (value: string) => new Date(value).toLocaleString();

const columns: TableColumn<VendorIncomingOrderRow>[] = [
  {
    header: INCOMING_ORDER_LIST_COLUMNS[0],
    key: 'orderNumber',
    render: (row) => <Link to={`/orders/${row.orderId}`}>{row.orderNumber}</Link>,
  },
  {
    header: INCOMING_ORDER_LIST_COLUMNS[1],
    key: 'orderStatus',
    render: (row) => <VendorOrderStatusBadge status={row.orderStatus} />,
  },
  {
    header: INCOMING_ORDER_LIST_COLUMNS[2],
    key: 'storeStatus',
    render: (row) => <VendorStoreStatusBadge status={row.storeStatus} />,
  },
  { header: INCOMING_ORDER_LIST_COLUMNS[3], key: 'paymentStatus' },
  {
    header: INCOMING_ORDER_LIST_COLUMNS[4],
    key: 'grandTotal',
    render: (row) => `${row.currency} ${row.grandTotal.toFixed(2)}`,
  },
  {
    header: INCOMING_ORDER_LIST_COLUMNS[5],
    key: 'createdAt',
    render: (row) => formatDateTime(row.createdAt),
  },
  {
    header: INCOMING_ORDER_LIST_COLUMNS[6],
    key: 'slaStatus',
    render: (row) => <VendorOrderSlaBadge slaStatus={row.slaStatus} />,
  },
];

export function VendorIncomingOrdersTable({
  isFetching = false,
  orders,
}: {
  isFetching?: boolean;
  orders: VendorOrderListItem[];
}) {
  const rows = orders.map((order) => ({ ...order } as VendorIncomingOrderRow));

  return (
    <Table
      columns={columns}
      data={rows}
      emptyMessage="No incoming orders."
      loading={isFetching}
      rowKey="orderId"
    />
  );
}
