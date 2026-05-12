import { EmptyState, Table, type TableColumn } from '../../components/common';

type StoreRow = {
  id: string;
  name: string;
};

const columns: TableColumn<StoreRow>[] = [
  { header: 'Store ID', key: 'id' },
  { header: 'Name', key: 'name' },
];

const rows: StoreRow[] = [];

export function StoresPage() {
  return (
    <>
      <h1>Stores</h1>
      <Table columns={columns} data={rows} emptyMessage="No stores yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState description="Store management data will be added in the store module." title="No stores yet" />
      ) : null}
    </>
  );
}
