import { Link } from 'react-router-dom';

import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminDeliveryAgentSummary } from '../types/admin-delivery-agents.types';
import {
  formatDeliveryAgentDate,
  formatDeliveryAgentLabel,
  getDeliveryAgentActiveVariant,
  getDeliveryAgentAvailabilityVariant,
  getDeliveryAgentVerificationVariant,
} from '../utils/admin-delivery-agents-display.util';

type DeliveryAgentRow = AdminDeliveryAgentSummary & Record<string, unknown>;

const columns: TableColumn<DeliveryAgentRow>[] = [
  {
    header: 'Agent',
    key: 'agentId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.name}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.email ?? row.phone}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'isActive',
    render: row => (
      <Badge variant={getDeliveryAgentActiveVariant(row.isActive)}>
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    header: 'Availability',
    key: 'availabilityStatus',
    render: row => (
      <Badge variant={getDeliveryAgentAvailabilityVariant(row.availabilityStatus)}>
        {formatDeliveryAgentLabel(row.availabilityStatus)}
      </Badge>
    ),
  },
  {
    header: 'Verification',
    key: 'isVerified',
    render: row => (
      <Badge variant={getDeliveryAgentVerificationVariant(row.isVerified)}>
        {row.isVerified ? 'Verified' : 'Unverified'}
      </Badge>
    ),
  },
  {
    header: 'Vehicle',
    key: 'vehicleType',
    render: row => `${formatDeliveryAgentLabel(row.vehicleType)} · ${row.vehicleNumber ?? '—'}`,
  },
  {
    header: 'City',
    key: 'cityId',
    render: row => row.cityId ?? '—',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatDeliveryAgentDate(row.updatedAt),
  },
  {
    header: 'Actions',
    key: 'userId',
    render: row => <Link to={`/delivery-agents/${row.agentId}`}>View</Link>,
  },
];

export function DeliveryAgentsTable({
  agents,
  loading,
}: {
  agents: AdminDeliveryAgentSummary[];
  loading?: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={agents as DeliveryAgentRow[]}
      emptyMessage="No delivery agents found."
      loading={loading}
      rowKey="agentId"
    />
  );
}

