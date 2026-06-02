import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminStoreOrderSummary } from '../types/admin-vendor-store.types';
import {
  formatVendorStoreDate,
  formatVendorStoreLabel,
  formatVendorStoreMoney,
} from '../utils/admin-vendor-store-display.util';

type StoreOrderRow = AdminStoreOrderSummary & Record<string, unknown>;

const columns: TableColumn<StoreOrderRow>[] = [
  {
    header: 'Order',
    key: 'orderId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.orderNumber}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.orderId}</span>
      </div>
    ),
  },
  {
    header: 'Order Status',
    key: 'orderStatus',
    render: row => <Badge variant="neutral">{formatVendorStoreLabel(row.orderStatus)}</Badge>,
  },
  {
    header: 'Store Status',
    key: 'storeStatus',
    render: row => formatVendorStoreLabel(row.storeStatus),
  },
  {
    header: 'Payment',
    key: 'paymentStatus',
    render: row => formatVendorStoreLabel(row.paymentStatus),
  },
  {
    header: 'Total',
    key: 'grandTotal',
    render: row => formatVendorStoreMoney(row.grandTotal, row.currency),
  },
  {
    header: 'Items',
    key: 'itemCount',
  },
  {
    header: 'Placed',
    key: 'placedAt',
    render: row => formatVendorStoreDate(row.placedAt),
  },
];

export function StoreOrdersTable({
  loading,
  orders,
}: {
  loading?: boolean;
  orders: AdminStoreOrderSummary[];
}) {
  return (
    <Table
      columns={columns}
      data={orders as StoreOrderRow[]}
      emptyMessage="No store orders found."
      loading={loading}
      rowKey="orderId"
    />
  );
}
