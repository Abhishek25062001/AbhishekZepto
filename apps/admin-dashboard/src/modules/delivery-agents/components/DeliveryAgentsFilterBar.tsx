import { Button, Input } from '../../../components/common';
import {
  DELIVERY_AGENT_AVAILABILITY_OPTIONS,
  DELIVERY_AGENT_STATUS_OPTIONS,
  DELIVERY_AGENT_VERIFICATION_OPTIONS,
} from '../constants/admin-delivery-agents.constants';
import type {
  AdminDeliveryAgentListQuery,
  DeliveryAgentAvailabilityStatus,
  DeliveryAgentManagementStatus,
  DeliveryAgentVerificationStatus,
} from '../types/admin-delivery-agents.types';

type DeliveryAgentsFilterBarProps = {
  filters: AdminDeliveryAgentListQuery;
  onChange: (filters: AdminDeliveryAgentListQuery) => void;
};

const fieldStyle = {
  display: 'grid',
  gap: 6,
  minWidth: 180,
} as const;

const labelStyle = {
  color: 'var(--color-text-secondary)',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
} as const;

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

export function DeliveryAgentsFilterBar({ filters, onChange }: DeliveryAgentsFilterBarProps) {
  const updateFilters = (next: Partial<AdminDeliveryAgentListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Delivery agent filters"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-lg)',
      }}
    >
      <label style={fieldStyle}>
        <span style={labelStyle}>Status</span>
        <select
          onChange={event => updateFilters({
            status: event.target.value
              ? (event.target.value as DeliveryAgentManagementStatus)
              : undefined,
          })}
          style={selectStyle}
          value={filters.status ?? ''}
        >
          <option value="">All statuses</option>
          {DELIVERY_AGENT_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Availability</span>
        <select
          onChange={event => updateFilters({
            availabilityStatus: event.target.value
              ? (event.target.value as DeliveryAgentAvailabilityStatus)
              : undefined,
          })}
          style={selectStyle}
          value={filters.availabilityStatus ?? ''}
        >
          <option value="">All availability</option>
          {DELIVERY_AGENT_AVAILABILITY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Verification</span>
        <select
          onChange={event => updateFilters({
            verificationStatus: event.target.value
              ? (event.target.value as DeliveryAgentVerificationStatus)
              : undefined,
          })}
          style={selectStyle}
          value={filters.verificationStatus ?? ''}
        >
          <option value="">All verification</option>
          {DELIVERY_AGENT_VERIFICATION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <Input
        label="City ID"
        onChange={event => updateFilters({ cityId: event.target.value || undefined })}
        placeholder="Filter by city ID"
        value={filters.cityId ?? ''}
      />

      <Input
        label="Search"
        onChange={event => updateFilters({ search: event.target.value || undefined })}
        placeholder="Name, phone, email, or vehicle"
        value={filters.search ?? ''}
      />

      <div style={{ alignSelf: 'end' }}>
        <Button
          onClick={() => onChange({ page: 1, limit: filters.limit ?? 20 })}
          type="button"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </section>
  );
}

