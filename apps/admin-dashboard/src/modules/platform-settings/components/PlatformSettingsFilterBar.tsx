import { Button, Input } from '../../../components/common';
import {
  PLATFORM_SETTING_CATEGORY_OPTIONS,
  PLATFORM_SETTING_DEFAULT_FILTERS,
  PLATFORM_SETTING_SCOPE_OPTIONS,
} from '../constants/platform-settings.constants';
import type {
  PlatformSettingCategory,
  PlatformSettingsListQuery,
  PlatformSettingScopeType,
} from '../types/platform-settings.types';

type PlatformSettingsFilterBarProps = {
  filters: PlatformSettingsListQuery;
  onChange: (filters: PlatformSettingsListQuery) => void;
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

export function PlatformSettingsFilterBar({ filters, onChange }: PlatformSettingsFilterBarProps) {
  const updateFilters = (next: Partial<PlatformSettingsListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Platform settings filters"
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
        <span style={labelStyle}>Category</span>
        <select
          id="platform-setting-category-filter"
          onChange={event => updateFilters({
            category: event.target.value ? (event.target.value as PlatformSettingCategory) : undefined,
          })}
          style={selectStyle}
          value={filters.category ?? ''}
        >
          <option value="">All categories</option>
          {PLATFORM_SETTING_CATEGORY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Scope</span>
        <select
          id="platform-setting-scope-filter"
          onChange={event => updateFilters({
            scopeType: event.target.value ? (event.target.value as PlatformSettingScopeType) : undefined,
          })}
          style={selectStyle}
          value={filters.scopeType ?? ''}
        >
          <option value="">All scopes</option>
          {PLATFORM_SETTING_SCOPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <Input
        id="platform-setting-scope-id-filter"
        label="Scope ID"
        onChange={event => updateFilters({ scopeId: event.target.value || undefined })}
        placeholder="City or store scope"
        value={filters.scopeId ?? ''}
      />

      <Input
        id="platform-setting-search-filter"
        label="Search"
        onChange={event => updateFilters({ search: event.target.value || undefined })}
        placeholder="Key or description"
        value={filters.search ?? ''}
      />

      <div style={{ alignSelf: 'end' }}>
        <Button
          onClick={() => onChange(PLATFORM_SETTING_DEFAULT_FILTERS)}
          type="button"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
