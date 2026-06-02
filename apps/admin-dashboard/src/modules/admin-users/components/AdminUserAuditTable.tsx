import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminUserAuditRecord } from '../types/admin-users.types';
import { formatAdminUserDate, formatAdminUserLabel } from '../utils/admin-users-display.util';

type AuditRow = AdminUserAuditRecord & Record<string, unknown>;

const columns: TableColumn<AuditRow>[] = [
  {
    header: 'Action',
    key: 'actionType',
    render: row => <Badge variant="info">{formatAdminUserLabel(row.actionType)}</Badge>,
  },
  {
    header: 'Reason',
    key: 'reason',
    render: row => row.reason || '—',
  },
  {
    header: 'Admin ID',
    key: 'adminId',
    render: row => <code style={{ fontSize: 12 }}>{row.adminId.slice(-8)}</code>,
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: row => formatAdminUserDate(row.createdAt),
  },
];

export function AdminUserAuditTable({
  audit,
  loading,
}: {
  audit: AdminUserAuditRecord[];
  loading?: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={audit as AuditRow[]}
      emptyMessage="No admin user audit records found."
      loading={loading}
      rowKey={(row, index) => `${row.actionType}-${row.createdAt}-${index}`}
    />
  );
}

