import { EmptyState, Table, type TableColumn } from '../../components/common';

type OrderRow = {
  id: string;
  status: string;
};

const columns: TableColumn<OrderRow>[] = [
  { header: 'Order ID', key: 'id' },
  { header: 'Status', key: 'status' },
];

const rows: OrderRow[] = [];

export function OrdersPage() {
  return (
    <>
      <h1>Orders</h1>
      <Table columns={columns} data={rows} emptyMessage="No orders yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState description="Order operations data will be added in the order module." title="No orders yet" />
      ) : null}
    </>
  );
}
