import { Badge } from '../../../components/common';
import type { ReactNode } from 'react';
import type { AdminDeliveryAgentSummary } from '../types/admin-delivery-agents.types';
import {
  formatDeliveryAgentDate,
  formatDeliveryAgentLabel,
  getDeliveryAgentActiveVariant,
  getDeliveryAgentAvailabilityVariant,
  getDeliveryAgentVerificationVariant,
} from '../utils/admin-delivery-agents-display.util';

type DeliveryAgentSummaryProps = {
  agent: AdminDeliveryAgentSummary;
};

const rowStyle = {
  display: 'grid',
  gap: 4,
} as const;

const labelStyle = {
  color: 'var(--color-text-secondary)',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
} as const;

function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function DeliveryAgentSummary({ agent }: DeliveryAgentSummaryProps) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gap: 'var(--spacing-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        padding: 'var(--spacing-lg)',
      }}
    >
      <SummaryItem label="Name" value={<strong>{agent.name}</strong>} />
      <SummaryItem label="Phone" value={agent.phone} />
      <SummaryItem label="Email" value={agent.email ?? '—'} />
      <SummaryItem label="Vehicle Type" value={formatDeliveryAgentLabel(agent.vehicleType)} />
      <SummaryItem label="Vehicle Number" value={agent.vehicleNumber ?? '—'} />
      <SummaryItem
        label="Availability"
        value={(
          <Badge variant={getDeliveryAgentAvailabilityVariant(agent.availabilityStatus)}>
            {formatDeliveryAgentLabel(agent.availabilityStatus)}
          </Badge>
        )}
      />
      <SummaryItem
        label="Verification"
        value={(
          <Badge variant={getDeliveryAgentVerificationVariant(agent.isVerified)}>
            {agent.isVerified ? 'Verified' : 'Unverified'}
          </Badge>
        )}
      />
      <SummaryItem
        label="Status"
        value={(
          <Badge variant={getDeliveryAgentActiveVariant(agent.isActive)}>
            {agent.isActive ? 'Active' : 'Inactive'}
          </Badge>
        )}
      />
      <SummaryItem label="City" value={agent.cityId ?? '—'} />
      <SummaryItem label="Current Assignment" value={agent.currentAssignmentId ?? '—'} />
      <SummaryItem label="Total Deliveries" value={agent.totalDeliveries} />
      <SummaryItem label="Forced Offline At" value={formatDeliveryAgentDate(agent.forcedOfflineAt)} />
      <SummaryItem label="Forced Offline Reason" value={agent.forcedOfflineReason ?? '—'} />
      <SummaryItem label="Forced Offline By" value={agent.forcedOfflineBy ?? '—'} />
      <SummaryItem label="Created" value={formatDeliveryAgentDate(agent.createdAt)} />
      <SummaryItem label="Updated" value={formatDeliveryAgentDate(agent.updatedAt)} />
    </section>
  );
}
