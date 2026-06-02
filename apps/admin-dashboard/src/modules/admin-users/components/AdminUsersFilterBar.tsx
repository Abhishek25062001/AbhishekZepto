import { Button, Input } from '../../../components/common';
import { ADMIN_USER_ROLE_OPTIONS, ADMIN_USER_STATUS_OPTIONS } from '../constants/admin-users.constants';
import type { AdminUserListQuery, AdminUserRole, AdminUserStatus } from '../types/admin-users.types';

type AdminUsersFilterBarProps = {
  filters: AdminUserListQuery;
  onChange: (filters: AdminUserListQuery) => void;
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

export function AdminUsersFilterBar({ filters, onChange }: AdminUsersFilterBarProps) {
  const updateFilters = (next: Partial<AdminUserListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Admin user filters"
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
        <span style={labelStyle}>Role</span>
        <select
          id="admin-users-role-filter"
          onChange={event => updateFilters({
            role: event.target.value ? (event.target.value as AdminUserRole) : undefined,
          })}
          style={selectStyle}
          value={filters.role ?? ''}
        >
          <option value="">All roles</option>
          {ADMIN_USER_ROLE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Status</span>
        <select
          id="admin-users-status-filter"
          onChange={event => updateFilters({
            status: event.target.value ? (event.target.value as AdminUserStatus) : undefined,
          })}
          style={selectStyle}
          value={filters.status ?? ''}
        >
          <option value="">All statuses</option>
          {ADMIN_USER_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <Input
        id="admin-users-city-filter"
        label="City ID"
        onChange={event => updateFilters({ cityId: event.target.value || undefined })}
        placeholder="Filter by city ID"
        value={filters.cityId ?? ''}
      />

      <Input
        id="admin-users-search-filter"
        label="Search"
        onChange={event => updateFilters({ search: event.target.value || undefined })}
        placeholder="Name, phone, or email"
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

