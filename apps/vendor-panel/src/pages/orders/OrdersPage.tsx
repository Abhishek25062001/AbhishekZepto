import { EmptyState, Table, type TableColumn } from '../../components/common';

type StoreOrderRow = {
  id: string;
  status: string;
};

const columns: TableColumn<StoreOrderRow>[] = [
  { header: 'Order ID', key: 'id' },
  { header: 'Status', key: 'status' },
];

const rows: StoreOrderRow[] = [];

export function OrdersPage() {
  return (
    <>
      <h1>Store Orders</h1>
      <Table columns={columns} data={rows} emptyMessage="No store orders yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState description="Store order data will be added in the order module." title="No orders yet" />
      ) : null}
    </>
  );
}
