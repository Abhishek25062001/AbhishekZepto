import { Link } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import type { AuditLogRecord } from '../types/audit-log.types';
import {
  formatAuditLogDate,
  formatAuditLogLabel,
  truncateAuditValue,
} from '../utils/audit-log-display.util';

type AuditLogTableProps = {
  auditLogs: AuditLogRecord[];
  loading?: boolean;
};

const columns: TableColumn<AuditLogRecord & Record<string, unknown>>[] = [
  {
    header: 'Action',
    key: 'actionType',
    render: row => formatAuditLogLabel(row.actionType),
  },
  {
    header: 'Entity',
    key: 'entityType',
    render: row => `${row.entityType} / ${truncateAuditValue(row.entityId)}`,
  },
  {
    header: 'Admin',
    key: 'adminId',
    render: row => truncateAuditValue(row.adminId),
  },
  {
    header: 'Reason',
    key: 'reason',
    render: row => truncateAuditValue(row.reason),
  },
  {
    header: 'IP / Device',
    key: 'ipAddress',
    render: row => `${row.ipAddress ?? 'Not available'} / ${truncateAuditValue(row.deviceInfo)}`,
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: row => formatAuditLogDate(row.createdAt),
  },
  {
    header: '',
    key: 'id',
    render: row => <Link to={`/audit-logs/${row.id}`}>View</Link>,
  },
];

export function AuditLogTable({ auditLogs, loading = false }: AuditLogTableProps) {
  return (
    <Table
      columns={columns}
      data={auditLogs as Array<AuditLogRecord & Record<string, unknown>>}
      emptyMessage="No audit logs found."
      loading={loading}
      rowKey="id"
    />
  );
}
