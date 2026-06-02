import { Table, type TableColumn } from '../../../components/common';
import type { AdminDeliveryAgentAuditRecord } from '../types/admin-delivery-agents.types';
import { formatDeliveryAgentDate, formatDeliveryAgentLabel } from '../utils/admin-delivery-agents-display.util';

type DeliveryAgentAuditRow = AdminDeliveryAgentAuditRecord & Record<string, unknown>;

const columns: TableColumn<DeliveryAgentAuditRow>[] = [
  {
    header: 'Action',
    key: 'actionType',
    render: row => formatDeliveryAgentLabel(row.actionType),
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
    render: row => formatDeliveryAgentDate(row.createdAt),
  },
];

export function DeliveryAgentAuditTable({
  audit,
  loading,
}: {
  audit: AdminDeliveryAgentAuditRecord[];
  loading?: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={audit as DeliveryAgentAuditRow[]}
      emptyMessage="No audit records found."
      loading={loading}
      rowKey="auditId"
    />
  );
}
