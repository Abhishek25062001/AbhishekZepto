import { Table, type TableColumn } from '../../../components/common';
import type { AdminOrderDetail } from '../types/admin-orders.types';
import { formatAdminOrderMoney } from '../utils/admin-orders-display.util';

type AdminOrderItem = AdminOrderDetail['items'][number] & Record<string, unknown>;

type AdminOrderItemsTableProps = {
  items: AdminOrderDetail['items'];
};

export function AdminOrderItemsTable({ items }: AdminOrderItemsTableProps) {
  const rows = items.map((item) => ({ ...item }));
  const columns: TableColumn<AdminOrderItem>[] = [
    { header: 'Product', key: 'productName', render: (row) => row.productName ?? row.productId },
    { header: 'Variant', key: 'variantId' },
    { header: 'Ordered', key: 'quantity' },
    { header: 'Picked', key: 'pickedQuantity' },
    { header: 'Missing', key: 'missingQuantity' },
    { header: 'Picking status', key: 'pickingStatus' },
    {
      header: 'Line total',
      key: 'lineTotal',
      render: (row) => formatAdminOrderMoney(row.lineTotal),
    },
  ];

  return (
    <section>
      <h2>Items</h2>
      <Table columns={columns} data={rows} emptyMessage="No items recorded." rowKey="storeProductId" />
    </section>
  );
}
