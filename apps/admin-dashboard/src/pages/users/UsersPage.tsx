import { EmptyState, Table, type TableColumn } from '../../components/common';

type UserRow = {
  id: string;
  role: string;
};

const columns: TableColumn<UserRow>[] = [
  { header: 'User ID', key: 'id' },
  { header: 'Role', key: 'role' },
];

const rows: UserRow[] = [];

export function UsersPage() {
  return (
    <>
      <h1>Users</h1>
      <Table columns={columns} data={rows} emptyMessage="No users yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState description="User management data will be added in the user module." title="No users yet" />
      ) : null}
    </>
  );
}
