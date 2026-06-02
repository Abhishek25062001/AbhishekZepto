import { Link } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import type { SupportTicket } from '../types/support.types';
import { formatSupportDate, formatSupportLabel } from '../utils/support-display.util';
import { SupportTicketPriorityBadge } from './SupportTicketPriorityBadge';
import { SupportTicketStatusBadge } from './SupportTicketStatusBadge';

type SupportTicketTableRow = SupportTicket & Record<string, unknown>;

const columns: TableColumn<SupportTicketTableRow>[] = [
  {
    header: 'Ticket',
    key: 'ticketId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.ticketNumber}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.subject}</span>
      </div>
    ),
  },
  {
    header: 'Category',
    key: 'category',
    render: row => formatSupportLabel(row.category),
  },
  {
    header: 'Status',
    key: 'status',
    render: row => <SupportTicketStatusBadge status={row.status} />,
  },
  {
    header: 'Priority',
    key: 'priority',
    render: row => <SupportTicketPriorityBadge priority={row.priority} />,
  },
  {
    header: 'Assigned',
    key: 'assignedAdminId',
    render: row => row.assignedAdminId ?? 'Unassigned',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatSupportDate(row.updatedAt),
  },
  {
    header: 'Actions',
    key: 'ticketNumber',
    render: row => <Link to={`/support/tickets/${row.ticketId}`}>View</Link>,
  },
];

export function SupportTicketTable({
  loading,
  tickets,
}: {
  loading?: boolean;
  tickets: SupportTicket[];
}) {
  return (
    <Table
      columns={columns}
      data={tickets as SupportTicketTableRow[]}
      emptyMessage="No support tickets found."
      loading={loading}
      rowKey="ticketId"
    />
  );
}
