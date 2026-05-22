import { Table, type TableColumn } from '../../../components/common';
import type { VendorOrderDetail } from '../types/vendor-orders.types';

type ItemRow = VendorOrderDetail['items'][number] & Record<string, unknown>;

const columns: TableColumn<ItemRow>[] = [
  { header: 'Product', key: 'productName', render: (row) => row.productName ?? row.productId },
  { header: 'Quantity', key: 'quantity' },
  { header: 'Unit price', key: 'unitPrice' },
  { header: 'Line total', key: 'lineTotal' },
  { header: 'Picking', key: 'pickingStatus' },
];

export function VendorIncomingOrderItemsTable({ items }: { items: VendorOrderDetail['items'] }) {
  const rows = items.map((item) => ({ ...item } as ItemRow));
  return <Table columns={columns} data={rows} emptyMessage="No order items." rowKey="storeProductId" />;
}
