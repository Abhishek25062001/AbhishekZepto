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
import { CitySelect } from '../../components/CitySelect';
import { LocationStatusBadge } from '../../components/StoreStatusBadge';
import { LOCATION_STATUS, LOCATION_STATUS_LABELS } from '../../constants/store.constants';
import { useServiceAreas } from '../../hooks/useServiceAreas';
import { useServiceAreaMutations } from '../../hooks/useServiceAreaMutations';
import type { ServiceAreaResponse } from '../../types/service-area.types';
import {
  DELETE_CONFIRMATION,
  extractApiErrorCode,
  mapStoreErrorCodeToMessage,
} from '../../utils/store-error-message.util';
import { setSearchParams } from '../../utils/store-query-param.util';

type ServiceAreaRow = ServiceAreaResponse & Record<string, unknown>;

export function ServiceAreaListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useServiceAreas();
  const { deleteMutation } = useServiceAreaMutations();
  const [pendingDelete, setPendingDelete] = useState<ServiceAreaResponse | null>(null);

  const rows = useMemo(
    () => (data?.items ?? []).map((item) => ({ ...item } as ServiceAreaRow)),
    [data?.items],
  );

  const columns: TableColumn<ServiceAreaRow>[] = [
    { header: 'Name', key: 'name' },
    { header: 'City', key: 'cityId' },
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
          <Link to={`/locations/service-areas/${row.id}/edit`}>Edit</Link>
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
          description="Define delivery polygons within each city."
          primaryActionHref="/locations/service-areas/new"
          primaryActionLabel="Create service area"
          requiredPermission="locations:create"
          title="Service areas"
        />
        <CatalogErrorState
          message={mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load service areas.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Define delivery polygons within each city."
        primaryActionHref="/locations/service-areas/new"
        primaryActionLabel="Create service area"
        requiredPermission="locations:create"
        title="Service areas"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <CitySelect
            label="City"
            value={searchParams.get('cityId') ?? undefined}
            onChange={(cityId) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { cityId: cityId ?? null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <div style={{ display: 'grid', gap: '6px' }}>
            <label htmlFor="service-area-status-filter">Status</label>
            <select
              id="service-area-status-filter"
              value={searchParams.get('status') ?? ''}
              onChange={(event) => {
                const params = new URLSearchParams(searchParams);
                setSearchParams(params, { page: 1, status: event.target.value || null });
                setUrlSearchParams(params, { replace: true });
              }}
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
        </div>
        {isLoading && !data ? <CatalogTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <CatalogEmptyState description="No service areas match your filters." title="No service areas" />
        ) : null}
        {rows.length > 0 ? (
          <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title={DELETE_CONFIRMATION.serviceArea}
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
