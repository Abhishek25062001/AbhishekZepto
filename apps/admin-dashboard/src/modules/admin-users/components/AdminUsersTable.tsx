import { Link } from 'react-router-dom';

import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminUserSummary } from '../types/admin-users.types';
import {
  formatAdminUserDate,
  formatAdminUserLabel,
  getAdminUserStatusVariant,
} from '../utils/admin-users-display.util';

type AdminUserTableRow = AdminUserSummary & Record<string, unknown>;

const columns: TableColumn<AdminUserTableRow>[] = [
  {
    header: 'Admin',
    key: 'adminUserId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.name ?? 'Unnamed admin'}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.email ?? row.phone}</span>
      </div>
    ),
  },
  {
    header: 'Role',
    key: 'role',
    render: row => formatAdminUserLabel(row.role),
  },
  {
    header: 'Status',
    key: 'status',
    render: row => (
      <Badge variant={getAdminUserStatusVariant(row.status)}>
        {formatAdminUserLabel(row.status)}
      </Badge>
    ),
  },
  {
    header: 'City Scope',
    key: 'cityScope',
    render: row => row.cityScope.length > 0 ? row.cityScope.length : 'All',
  },
  {
    header: 'Last Login',
    key: 'lastLoginAt',
    render: row => formatAdminUserDate(row.lastLoginAt),
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatAdminUserDate(row.updatedAt),
  },
  {
    header: 'Actions',
    key: 'userId',
    render: row => (
      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        <Link to={`/users/${row.adminUserId}`}>View</Link>
        <Link to={`/users/${row.userId}/sessions`}>Sessions</Link>
      </div>
    ),
  },
];

export function AdminUsersTable({
  loading,
  users,
}: {
  loading?: boolean;
  users: AdminUserSummary[];
}) {
  return (
    <Table
      columns={columns}
      data={users as AdminUserTableRow[]}
      emptyMessage="No admin users found."
      loading={loading}
      rowKey="adminUserId"
    />
  );
}

