import { useState } from 'react';

import { Button, EmptyState, ErrorView, Loader } from '../../../components/common';
import { DATA_EXPORT_DEFAULT_FILTERS } from '../constants/data-export.constants';
import { DataExportFilters } from '../components/DataExportFilters';
import { DataExportTable } from '../components/DataExportTable';
import { DataExportRequestForm } from '../forms/DataExportRequestForm';
import { useDataExports } from '../hooks/useDataExports';
import type { DataExportListQuery } from '../types/data-export.types';
import { getApiErrorMessage } from '../../../utils/error-message.util';

export function DataExportListPage() {
  const [filters, setFilters] = useState<DataExportListQuery>(DATA_EXPORT_DEFAULT_FILTERS);
  const { data, error, isLoading, refetch } = useDataExports(filters);
  const dataExports = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Exports</h1>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <DataExportRequestForm />

      <DataExportFilters filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load export requests.')}
          onRetry={() => void refetch()}
          title="Unable to load export requests"
        />
      ) : null}

      {isLoading ? <Loader label="Loading export requests..." /> : null}

      {!error ? <DataExportTable dataExports={dataExports} loading={isLoading} /> : null}

      {!isLoading && !error && dataExports.length === 0 ? (
        <EmptyState
          description="No export requests match the current filters."
          title="No export requests found"
        />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} export requests
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
