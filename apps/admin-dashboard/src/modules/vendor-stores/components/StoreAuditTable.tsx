import { Table, type TableColumn } from '../../../components/common';
import type { AdminStoreAuditSummary } from '../types/admin-vendor-store.types';
import { formatVendorStoreDate, formatVendorStoreLabel } from '../utils/admin-vendor-store-display.util';

type StoreAuditRow = AdminStoreAuditSummary & Record<string, unknown>;

const columns: TableColumn<StoreAuditRow>[] = [
  {
    header: 'Action',
    key: 'actionType',
    render: row => formatVendorStoreLabel(row.actionType),
  },
  {
    header: 'Admin',
    key: 'adminId',
  },
  {
    header: 'Reason',
    key: 'reason',
  },
  {
    header: 'IP Address',
    key: 'ipAddress',
    render: row => row.ipAddress ?? '—',
  },
  {
    header: 'Device',
    key: 'deviceInfo',
    render: row => row.deviceInfo ?? '—',
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: row => formatVendorStoreDate(row.createdAt),
  },
];

export function StoreAuditTable({
  audit,
  loading,
}: {
  audit: AdminStoreAuditSummary[];
  loading?: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={audit as StoreAuditRow[]}
      emptyMessage="No store audit records found."
      loading={loading}
      rowKey="auditId"
    />
  );
}
