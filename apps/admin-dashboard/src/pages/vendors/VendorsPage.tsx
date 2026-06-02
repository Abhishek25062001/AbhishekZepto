import { useState } from 'react';

import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { VendorsFilterBar } from '../../modules/vendor-stores/components/VendorsFilterBar';
import { VendorsTable } from '../../modules/vendor-stores/components/VendorsTable';
import { useAdminVendors } from '../../modules/vendor-stores/hooks/useAdminVendors';
import type { AdminVendorListQuery } from '../../modules/vendor-stores/types/admin-vendor-store.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

export function VendorsPage() {
  const [filters, setFilters] = useState<AdminVendorListQuery>({ page: 1, limit: 20 });
  const { data, error, isLoading, refetch } = useAdminVendors(filters);
  const vendors = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Vendors</h1>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <VendorsFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load vendors.')}
          onRetry={() => void refetch()}
          title="Unable to load vendors"
        />
      ) : null}

      {isLoading ? <Loader label="Loading vendors..." /> : null}

      {!error ? <VendorsTable loading={isLoading} vendors={vendors} /> : null}

      {!isLoading && !error && vendors.length === 0 ? (
        <EmptyState description="No vendors match the current filters." title="No vendors found" />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} vendors
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
