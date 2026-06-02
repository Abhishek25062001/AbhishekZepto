import { Button, Input } from '../../../components/common';
import { AUDIT_LOG_DEFAULT_FILTERS } from '../constants/audit-log.constants';
import type { AuditLogsListQuery } from '../types/audit-log.types';

type AuditLogFilterBarProps = {
  filters: AuditLogsListQuery;
  onChange: (filters: AuditLogsListQuery) => void;
};

export function AuditLogFilterBar({ filters, onChange }: AuditLogFilterBarProps) {
  const updateFilters = (next: Partial<AuditLogsListQuery>) => {
    onChange({ ...filters, ...next, page: 1 });
  };

  return (
    <section
      aria-label="Audit log filters"
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
      <Input
        id="audit-log-admin-id-filter"
        label="Admin ID"
        onChange={event => updateFilters({ adminId: event.target.value || undefined })}
        value={filters.adminId ?? ''}
      />
      <Input
        id="audit-log-action-type-filter"
        label="Action"
        onChange={event => updateFilters({ actionType: event.target.value || undefined })}
        value={filters.actionType ?? ''}
      />
      <Input
        id="audit-log-entity-type-filter"
        label="Entity type"
        onChange={event => updateFilters({ entityType: event.target.value || undefined })}
        value={filters.entityType ?? ''}
      />
      <Input
        id="audit-log-entity-id-filter"
        label="Entity ID"
        onChange={event => updateFilters({ entityId: event.target.value || undefined })}
        value={filters.entityId ?? ''}
      />
      <Input
        id="audit-log-from-filter"
        label="From"
        onChange={event => updateFilters({ from: event.target.value || undefined })}
        type="datetime-local"
        value={filters.from ?? ''}
      />
      <Input
        id="audit-log-to-filter"
        label="To"
        onChange={event => updateFilters({ to: event.target.value || undefined })}
        type="datetime-local"
        value={filters.to ?? ''}
      />
      <div style={{ alignSelf: 'end' }}>
        <Button onClick={() => onChange(AUDIT_LOG_DEFAULT_FILTERS)} type="button" variant="outline">
          Reset
        </Button>
      </div>
    </section>
  );
}
