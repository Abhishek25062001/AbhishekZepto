import { EmptyState, Table, type TableColumn } from '../../components/common';

type InventoryRow = {
  sku: string;
  stock: string;
};

const columns: TableColumn<InventoryRow>[] = [
  { header: 'SKU', key: 'sku' },
  { header: 'Stock', key: 'stock' },
];

const rows: InventoryRow[] = [];

export function InventoryPage() {
  return (
    <>
      <h1>Store Inventory</h1>
      <Table columns={columns} data={rows} emptyMessage="No inventory records yet." rowKey="sku" />
      {rows.length === 0 ? (
        <EmptyState description="Inventory data will be added in the inventory module." title="No inventory yet" />
      ) : null}
    </>
  );
}
