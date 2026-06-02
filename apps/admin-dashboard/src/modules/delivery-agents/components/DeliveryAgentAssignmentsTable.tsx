import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminDeliveryAgentAssignmentSummary } from '../types/admin-delivery-agents.types';
import {
  formatDeliveryAgentDate,
  formatDeliveryAgentLabel,
} from '../utils/admin-delivery-agents-display.util';

type DeliveryAgentAssignmentRow = AdminDeliveryAgentAssignmentSummary & Record<string, unknown>;

const columns: TableColumn<DeliveryAgentAssignmentRow>[] = [
  {
    header: 'Delivery',
    key: 'deliveryId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.deliveryId}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>Order {row.orderId}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'deliveryStatus',
    render: row => <Badge variant="neutral">{formatDeliveryAgentLabel(row.deliveryStatus)}</Badge>,
  },
  {
    header: 'Source',
    key: 'assignmentSource',
    render: row => row.assignmentSource ? formatDeliveryAgentLabel(row.assignmentSource) : '—',
  },
  {
    header: 'Assigned',
    key: 'assignedAt',
    render: row => formatDeliveryAgentDate(row.assignedAt),
  },
  {
    header: 'Picked Up',
    key: 'pickedUpAt',
    render: row => formatDeliveryAgentDate(row.pickedUpAt),
  },
  {
    header: 'Completed',
    key: 'completedAt',
    render: row => formatDeliveryAgentDate(row.completedAt ?? row.deliveredAt),
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatDeliveryAgentDate(row.updatedAt),
  },
];

export function DeliveryAgentAssignmentsTable({
  assignments,
  loading,
}: {
  assignments: AdminDeliveryAgentAssignmentSummary[];
  loading?: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={assignments as DeliveryAgentAssignmentRow[]}
      emptyMessage="No assignment records found."
      loading={loading}
      rowKey="deliveryId"
    />
  );
}
