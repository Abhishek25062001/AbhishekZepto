import { useState } from 'react';

import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { StoresFilterBar } from '../../modules/vendor-stores/components/StoresFilterBar';
import { StoresTable } from '../../modules/vendor-stores/components/StoresTable';
import { useAdminStores } from '../../modules/vendor-stores/hooks/useAdminStores';
import type { AdminStoreListQuery } from '../../modules/vendor-stores/types/admin-vendor-store.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

export function AdminStoresPage() {
  const [filters, setFilters] = useState<AdminStoreListQuery>({ page: 1, limit: 20 });
  const { data, error, isLoading, refetch } = useAdminStores(filters);
  const stores = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Stores</h1>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <StoresFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load stores.')}
          onRetry={() => void refetch()}
          title="Unable to load stores"
        />
      ) : null}

      {isLoading ? <Loader label="Loading stores..." /> : null}

      {!error ? <StoresTable loading={isLoading} stores={stores} /> : null}

      {!isLoading && !error && stores.length === 0 ? (
        <EmptyState description="No stores match the current filters." title="No stores found" />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} stores
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
