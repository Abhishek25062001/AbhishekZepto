import { Card, Table, type TableColumn } from '../../../components/common';
import { useSupportTicketAudit } from '../hooks/useSupportTicketAudit';
import type { SupportTicketAuditRecord } from '../types/support.types';
import { formatSupportDate, formatSupportLabel } from '../utils/support-display.util';

type SupportTicketAuditTableRow = SupportTicketAuditRecord & Record<string, unknown>;

const columns: TableColumn<SupportTicketAuditTableRow>[] = [
  {
    header: 'Action',
    key: 'actionType',
    render: row => formatSupportLabel(row.actionType),
  },
  {
    header: 'Reason',
    key: 'reason',
  },
  {
    header: 'Admin',
    key: 'adminId',
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: row => formatSupportDate(row.createdAt),
  },
];

export function SupportTicketAuditTable({ ticketId }: { ticketId: string }) {
  const { data: audit = [], error, isLoading } = useSupportTicketAudit(ticketId);

  return (
    <Card title="Audit">
      {error ? (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          Unable to load audit records.
        </p>
      ) : null}
      <Table
        columns={columns}
        data={audit as SupportTicketAuditTableRow[]}
        emptyMessage="No support ticket audit records found."
        loading={isLoading}
      />
    </Card>
  );
}
