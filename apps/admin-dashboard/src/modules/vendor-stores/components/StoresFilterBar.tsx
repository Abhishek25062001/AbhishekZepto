import { Button, Input } from '../../../components/common';
import { STORE_STATUS_OPTIONS } from '../constants/admin-vendor-store.constants';
import type { AdminStoreListQuery, StoreManagementStatus } from '../types/admin-vendor-store.types';

type StoresFilterBarProps = {
  filters: AdminStoreListQuery;
  onChange: (filters: AdminStoreListQuery) => void;
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

export function StoresFilterBar({ filters, onChange }: StoresFilterBarProps) {
  const updateFilters = (next: Partial<AdminStoreListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Store filters"
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
            status: event.target.value ? (event.target.value as StoreManagementStatus) : undefined,
          })}
          style={selectStyle}
          value={filters.status ?? ''}
        >
          <option value="">All statuses</option>
          {STORE_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <Input
        label="Vendor ID"
        onChange={event => updateFilters({ vendorId: event.target.value || undefined })}
        placeholder="Filter by vendor ID"
        value={filters.vendorId ?? ''}
      />

      <Input
        label="City ID"
        onChange={event => updateFilters({ cityId: event.target.value || undefined })}
        placeholder="Filter by city ID"
        value={filters.cityId ?? ''}
      />

      <Input
        label="Search"
        onChange={event => updateFilters({ search: event.target.value || undefined })}
        placeholder="Name, slug, code, phone, or email"
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
