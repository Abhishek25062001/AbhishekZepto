import { Button, Input } from '../../../components/common';
import { DELIVERY_ASSIGNMENT_STATUS_OPTIONS } from '../constants/admin-delivery-agents.constants';
import type { AdminDeliveryAgentAssignmentsQuery } from '../types/admin-delivery-agents.types';

type DeliveryAgentAssignmentsFilterBarProps = {
  filters: AdminDeliveryAgentAssignmentsQuery;
  onChange: (filters: AdminDeliveryAgentAssignmentsQuery) => void;
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

export function DeliveryAgentAssignmentsFilterBar({
  filters,
  onChange,
}: DeliveryAgentAssignmentsFilterBarProps) {
  const updateFilters = (next: Partial<AdminDeliveryAgentAssignmentsQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Delivery assignment filters"
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
        <span style={labelStyle}>Delivery Status</span>
        <select
          onChange={event => updateFilters({ status: event.target.value || undefined })}
          style={selectStyle}
          value={filters.status ?? ''}
        >
          <option value="">All delivery statuses</option>
          {DELIVERY_ASSIGNMENT_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <Input
        label="From Date"
        onChange={event => updateFilters({ fromDate: event.target.value || undefined })}
        type="date"
        value={filters.fromDate ?? ''}
      />

      <Input
        label="To Date"
        onChange={event => updateFilters({ toDate: event.target.value || undefined })}
        type="date"
        value={filters.toDate ?? ''}
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
