import { Link } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import type { AdminOrderListItem } from '../types/admin-orders.types';
import {
  ADMIN_ORDER_PAYMENT_STATUS_LABELS,
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STORE_STATUS_LABELS,
  formatAdminOrderDate,
  formatAdminOrderMoney,
} from '../utils/admin-orders-display.util';

type AdminOrderRow = AdminOrderListItem & Record<string, unknown>;

type AdminOrderTableProps = {
  loading?: boolean;
  orders: AdminOrderListItem[];
};

export function AdminOrderTable({ loading = false, orders }: AdminOrderTableProps) {
  const rows = orders.map((order) => ({ ...order }));

  const columns: TableColumn<AdminOrderRow>[] = [
    {
      header: 'Order',
      key: 'orderNumber',
      render: (row) => <Link to={`/orders/${row.orderId}`}>{row.orderNumber}</Link>,
    },
    { header: 'Customer', key: 'customerId' },
    { header: 'Store', key: 'storeId' },
    {
      header: 'Status',
      key: 'orderStatus',
      render: (row) => ADMIN_ORDER_STATUS_LABELS[row.orderStatus],
    },
    {
      header: 'Store status',
      key: 'storeStatus',
      render: (row) => ADMIN_ORDER_STORE_STATUS_LABELS[row.storeStatus],
    },
    {
      header: 'Payment',
      key: 'paymentStatus',
      render: (row) => ADMIN_ORDER_PAYMENT_STATUS_LABELS[row.paymentStatus],
    },
    {
      header: 'Total',
      key: 'grandTotal',
      render: (row) => formatAdminOrderMoney(row.grandTotal, row.currency),
    },
    {
      header: 'Created',
      key: 'createdAt',
      render: (row) => formatAdminOrderDate(row.createdAt),
    },
    {
      header: 'SLA',
      key: 'slaStatus',
      render: (row) => row.slaStatus ?? 'Not available',
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      emptyMessage="No orders match the selected filters."
      loading={loading}
      rowKey="orderId"
    />
  );
}
