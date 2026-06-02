import { Button, Input } from '../../../components/common';
import {
  SUPPORT_TICKET_CATEGORY_OPTIONS,
  SUPPORT_TICKET_PRIORITY_OPTIONS,
  SUPPORT_TICKET_STATUS_OPTIONS,
} from '../constants/support.constants';
import type {
  SupportTicketCategory,
  SupportTicketListQuery,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../types/support.types';

type SupportTicketFilterBarProps = {
  filters: SupportTicketListQuery;
  onChange: (filters: SupportTicketListQuery) => void;
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

export function SupportTicketFilterBar({ filters, onChange }: SupportTicketFilterBarProps) {
  const updateFilters = (next: Partial<SupportTicketListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Support ticket filters"
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
          id="support-status-filter"
          onChange={event => updateFilters({
            status: event.target.value ? (event.target.value as SupportTicketStatus) : undefined,
          })}
          style={selectStyle}
          value={filters.status ?? ''}
        >
          <option value="">All statuses</option>
          {SUPPORT_TICKET_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Priority</span>
        <select
          id="support-priority-filter"
          onChange={event => updateFilters({
            priority: event.target.value ? (event.target.value as SupportTicketPriority) : undefined,
          })}
          style={selectStyle}
          value={filters.priority ?? ''}
        >
          <option value="">All priorities</option>
          {SUPPORT_TICKET_PRIORITY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Category</span>
        <select
          id="support-category-filter"
          onChange={event => updateFilters({
            category: event.target.value ? (event.target.value as SupportTicketCategory) : undefined,
          })}
          style={selectStyle}
          value={filters.category ?? ''}
        >
          <option value="">All categories</option>
          {SUPPORT_TICKET_CATEGORY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <Input
        id="support-customer-filter"
        label="Customer ID"
        onChange={event => updateFilters({ customerId: event.target.value || undefined })}
        placeholder="Customer ID"
        value={filters.customerId ?? ''}
      />

      <Input
        id="support-order-filter"
        label="Order ID"
        onChange={event => updateFilters({ orderId: event.target.value || undefined })}
        placeholder="Order ID"
        value={filters.orderId ?? ''}
      />

      <Input
        id="support-assignee-filter"
        label="Assigned Admin ID"
        onChange={event => updateFilters({ assignedAdminId: event.target.value || undefined })}
        placeholder="Assigned admin ID"
        value={filters.assignedAdminId ?? ''}
      />

      <Input
        id="support-search-filter"
        label="Search"
        onChange={event => updateFilters({ search: event.target.value || undefined })}
        placeholder="Ticket number, subject, or description"
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
