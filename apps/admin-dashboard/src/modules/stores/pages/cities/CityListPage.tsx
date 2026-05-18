import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Table, type TableColumn } from '../../../../components/common';
import { CatalogEmptyState } from '../../../catalog/components/CatalogEmptyState';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { CatalogSearchInput } from '../../../catalog/components/CatalogSearchInput';
import { CatalogTableSkeleton } from '../../../catalog/components/CatalogTableSkeleton';
import { ConfirmDeleteDialog } from '../../../catalog/components/ConfirmDeleteDialog';
import { LocationStatusBadge } from '../../components/StoreStatusBadge';
import { LOCATION_STATUS, LOCATION_STATUS_LABELS } from '../../constants/store.constants';
import { useCities } from '../../hooks/useCities';
import { useCityMutations } from '../../hooks/useCityMutations';
import type { CityResponse } from '../../types/city.types';
import {
  DELETE_CONFIRMATION,
  extractApiErrorCode,
  mapStoreErrorCodeToMessage,
} from '../../utils/store-error-message.util';
import { setSearchParams } from '../../utils/store-query-param.util';

type CityRow = CityResponse & Record<string, unknown>;

export function CityListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useCities();
  const { deleteMutation } = useCityMutations();
  const [pendingDelete, setPendingDelete] = useState<CityResponse | null>(null);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as CityRow)), [data?.items]);

  const columns: TableColumn<CityRow>[] = [
    { header: 'Name', key: 'name' },
    { header: 'State', key: 'state' },
    {
      header: 'Serviceable',
      key: 'isServiceable',
      render: (row) => (row.isServiceable ? 'Yes' : 'No'),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <LocationStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to={`/locations/cities/${row.id}/edit`}>Edit</Link>
          <CanAccess permission="locations:delete">
            <Button size="sm" type="button" variant="danger" onClick={() => setPendingDelete(row)}>
              Delete
            </Button>
          </CanAccess>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <>
        <CatalogPageHeader
          description="Manage serviceable cities and regional settings."
          primaryActionHref="/locations/cities/new"
          primaryActionLabel="Create city"
          requiredPermission="locations:create"
          title="Cities"
        />
        <CatalogErrorState
          message={mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load cities.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Manage serviceable cities and regional settings."
        primaryActionHref="/locations/cities/new"
        primaryActionLabel="Create city"
        requiredPermission="locations:create"
        title="Cities"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <StatusFilter
          value={searchParams.get('status') ?? ''}
          onChange={(next) => {
            const params = new URLSearchParams(searchParams);
            setSearchParams(params, { page: 1, status: next || null });
            setUrlSearchParams(params, { replace: true });
          }}
        />
        {isLoading && !data ? <CatalogTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <CatalogEmptyState description="No cities match your filters." title="No cities" />
        ) : null}
        {rows.length > 0 ? (
          <Table
            columns={columns}
            data={rows}
            loading={isFetching && Boolean(data)}
            rowKey="id"
          />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title={DELETE_CONFIRMATION.city}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(pendingDelete.id).then(() => setPendingDelete(null));
        }}
      />
    </>
  );
}

function StatusFilter({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor="city-status-filter">Status</label>
      <select
        id="city-status-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}
      >
        <option value="">All statuses</option>
        {Object.values(LOCATION_STATUS).map((status) => (
          <option key={status} value={status}>
            {LOCATION_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  );
}