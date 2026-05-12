import { EmptyState, Table, type TableColumn } from '../../components/common';

type ProductRow = {
  id: string;
  name: string;
};

const columns: TableColumn<ProductRow>[] = [
  { header: 'Product ID', key: 'id' },
  { header: 'Name', key: 'name' },
];

const rows: ProductRow[] = [];

export function ProductsPage() {
  return (
    <>
      <h1>Products</h1>
      <Table columns={columns} data={rows} emptyMessage="No products yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState description="Product data will be added in the catalog module." title="No products yet" />
      ) : null}
    </>
  );
}
