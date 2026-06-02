import { Card } from '../../../components/common';
import type { SupportTicket } from '../types/support.types';
import { formatSupportDate, formatSupportLabel } from '../utils/support-display.util';
import { SupportTicketPriorityBadge } from './SupportTicketPriorityBadge';
import { SupportTicketStatusBadge } from './SupportTicketStatusBadge';

const gridStyle = {
  display: 'grid',
  gap: 'var(--spacing-md)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
} as const;

const labelStyle = {
  color: 'var(--color-text-secondary)',
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
} as const;

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <div>{value}</div>
    </div>
  );
}

export function SupportTicketSummary({ ticket }: { ticket: SupportTicket }) {
  return (
    <Card title={`${ticket.ticketNumber} · ${ticket.subject}`}>
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <p style={{ margin: 0 }}>{ticket.description}</p>
        <div style={gridStyle}>
          <Field label="Status" value={<SupportTicketStatusBadge status={ticket.status} />} />
          <Field label="Priority" value={<SupportTicketPriorityBadge priority={ticket.priority} />} />
          <Field label="Category" value={formatSupportLabel(ticket.category)} />
          <Field label="Customer ID" value={ticket.customerId ?? '—'} />
          <Field label="Order ID" value={ticket.orderId ?? '—'} />
          <Field label="Assigned Admin ID" value={ticket.assignedAdminId ?? 'Unassigned'} />
          <Field label="Created By" value={ticket.createdByAdminId ?? '—'} />
          <Field label="Last Activity" value={formatSupportDate(ticket.lastActivityAt)} />
          <Field label="Resolved At" value={formatSupportDate(ticket.resolvedAt)} />
          <Field label="Closed At" value={formatSupportDate(ticket.closedAt)} />
          <Field label="Created" value={formatSupportDate(ticket.createdAt)} />
          <Field label="Updated" value={formatSupportDate(ticket.updatedAt)} />
        </div>
        {ticket.resolutionSummary ? (
          <Field label="Resolution Summary" value={ticket.resolutionSummary} />
        ) : null}
        {ticket.tags.length > 0 ? (
          <Field label="Tags" value={ticket.tags.join(', ')} />
        ) : null}
      </div>
    </Card>
  );
}
