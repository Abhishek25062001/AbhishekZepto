import { Button, Input } from '../../../components/common';
import { DATA_EXPORT_DEFAULT_FILTERS } from '../constants/data-export.constants';
import {
  DATA_EXPORT_FORMATS,
  DATA_EXPORT_STATUSES,
  DATA_EXPORT_TYPES,
  type DataExportFormat,
  type DataExportListQuery,
  type DataExportStatus,
  type DataExportType,
} from '../types/data-export.types';
import { formatDataExportLabel } from '../utils/data-export-display.util';

type DataExportFiltersProps = {
  filters: DataExportListQuery;
  onChange: (filters: DataExportListQuery) => void;
};

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 42,
  padding: '0 var(--spacing-md)',
};

export function DataExportFilters({ filters, onChange }: DataExportFiltersProps) {
  const updateFilters = (next: Partial<DataExportListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Data export filters"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        padding: 'var(--spacing-lg)',
      }}
    >
      <label style={{ display: 'grid', gap: '6px' }}>
        Export type
        <select
          style={selectStyle}
          value={filters.exportType ?? ''}
          onChange={(event) => updateFilters({
            exportType: (event.target.value || undefined) as DataExportType | undefined,
          })}
        >
          <option value="">All types</option>
          {DATA_EXPORT_TYPES.map((type) => (
            <option key={type} value={type}>
              {formatDataExportLabel(type)}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'grid', gap: '6px' }}>
        Format
        <select
          style={selectStyle}
          value={filters.format ?? ''}
          onChange={(event) => updateFilters({
            format: (event.target.value || undefined) as DataExportFormat | undefined,
          })}
        >
          <option value="">All formats</option>
          {DATA_EXPORT_FORMATS.map((format) => (
            <option key={format} value={format}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'grid', gap: '6px' }}>
        Status
        <select
          style={selectStyle}
          value={filters.status ?? ''}
          onChange={(event) => updateFilters({
            status: (event.target.value || undefined) as DataExportStatus | undefined,
          })}
        >
          <option value="">All statuses</option>
          {DATA_EXPORT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <Input
        id="data-export-requested-by-filter"
        label="Requested by"
        onChange={(event) => updateFilters({ requestedByAdminId: event.target.value || undefined })}
        value={filters.requestedByAdminId ?? ''}
      />
      <Input
        id="data-export-from-filter"
        label="From"
        onChange={(event) => updateFilters({ fromDate: event.target.value || undefined })}
        type="date"
        value={filters.fromDate ?? ''}
      />
      <Input
        id="data-export-to-filter"
        label="To"
        onChange={(event) => updateFilters({ toDate: event.target.value || undefined })}
        type="date"
        value={filters.toDate ?? ''}
      />
      <div style={{ alignSelf: 'end' }}>
        <Button
          onClick={() => onChange(DATA_EXPORT_DEFAULT_FILTERS)}
          type="button"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
