import { useState } from 'react';

import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { AuditLogFilterBar } from '../../modules/audit-logs/components/AuditLogFilterBar';
import { AuditLogTable } from '../../modules/audit-logs/components/AuditLogTable';
import { AUDIT_LOG_DEFAULT_FILTERS } from '../../modules/audit-logs/constants/audit-log.constants';
import { useAuditLogs } from '../../modules/audit-logs/hooks/useAuditLogs';
import type { AuditLogsListQuery } from '../../modules/audit-logs/types/audit-log.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

export function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogsListQuery>(AUDIT_LOG_DEFAULT_FILTERS);
  const { data, error, isLoading, refetch } = useAuditLogs(filters);
  const auditLogs = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Audit Logs</h1>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <AuditLogFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load audit logs.')}
          onRetry={() => void refetch()}
          title="Unable to load audit logs"
        />
      ) : null}

      {isLoading ? <Loader label="Loading audit logs..." /> : null}

      {!error ? <AuditLogTable auditLogs={auditLogs} loading={isLoading} /> : null}

      {!isLoading && !error && auditLogs.length === 0 ? (
        <EmptyState
          description="No audit logs match the current filters."
          title="No audit logs found"
        />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} audit logs
          </span>
          <Button
            disabled={!pagination.hasPreviousPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: Math.max(1, (previous.page ?? 1) - 1),
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: (previous.page ?? 1) + 1,
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </footer>
      ) : null}
    </div>
  );
}
