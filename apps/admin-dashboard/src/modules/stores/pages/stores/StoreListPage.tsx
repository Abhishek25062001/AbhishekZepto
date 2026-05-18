import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Input, Table, type TableColumn } from '../../../../components/common';
import { CatalogEmptyState } from '../../../catalog/components/CatalogEmptyState';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { CatalogSearchInput } from '../../../catalog/components/CatalogSearchInput';
import { CatalogTableSkeleton } from '../../../catalog/components/CatalogTableSkeleton';
import { ConfirmDeleteDialog } from '../../../catalog/components/ConfirmDeleteDialog';
import { CitySelect } from '../../components/CitySelect';
import { ServiceAreaSelect } from '../../components/ServiceAreaSelect';
import { StoreOpenBadge, StoreStatusBadge } from '../../components/StoreStatusBadge';
import {
  FULFILLMENT_TYPE,
  FULFILLMENT_TYPE_LABELS,
  STORE_STATUS,
  STORE_STATUS_LABELS,
  STORE_TYPE,
  STORE_TYPE_LABELS,
} from '../../constants/store.constants';
import { useStoreMutations } from '../../hooks/useStoreMutations';
import { useStores } from '../../hooks/useStores';
import type { StoreResponse } from '../../types/store.types';
import {
  DELETE_CONFIRMATION,
  extractApiErrorCode,
  mapStoreErrorCodeToMessage,
} from '../../utils/store-error-message.util';
import { setSearchParams } from '../../utils/store-query-param.util';

type StoreRow = StoreResponse & Record<string, unknown>;

export function StoreListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useStores();
  const { deleteMutation } = useStoreMutations();
  const [pendingDelete, setPendingDelete] = useState<StoreResponse | null>(null);

  const cityId = searchParams.get('cityId') ?? undefined;

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as StoreRow)), [data?.items]);

  const columns: TableColumn<StoreRow>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Code', key: 'code' },
    { header: 'Vendor', key: 'vendorId' },
    {
      header: 'Open',
      key: 'isOpen',
      render: (row) => <StoreOpenBadge isOpen={row.isOpen} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StoreStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to={`/stores/${row.id}`}>View</Link>
          <Link to={`/stores/${row.id}/edit`}>Edit</Link>
          <CanAccess permission="stores:delete">
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
          description="Manage vendor stores, operating hours, and fulfillment settings."
          primaryActionHref="/stores/new"
          primaryActionLabel="Create store"
          requiredPermission="stores:create"
          title="Stores"
        />
        <CatalogErrorState
          message={mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load stores.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Manage vendor stores, operating hours, and fulfillment settings."
        primaryActionHref="/stores/new"
        primaryActionLabel="Create store"
        requiredPermission="stores:create"
        title="Stores"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <Input
            label="Vendor ID"
            value={searchParams.get('vendorId') ?? ''}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { page: 1, vendorId: event.target.value || null });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <CitySelect
            label="City"
            value={cityId}
            onChange={(nextCityId) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, {
                cityId: nextCityId ?? null,
                page: 1,
                serviceAreaId: null,
              });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <ServiceAreaSelect
            cityId={cityId}
            label="Service area"
            value={searchParams.get('serviceAreaId') ?? undefined}
            onChange={(serviceAreaId) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { page: 1, serviceAreaId: serviceAreaId ?? null });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Status"
            options={[
              { label: 'All statuses', value: '' },
              ...Object.values(STORE_STATUS).map((status) => ({
                label: STORE_STATUS_LABELS[status],
                value: status,
              })),
            ]}
            value={searchParams.get('status') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { page: 1, status: next || null });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Store type"
            options={[
              { label: 'All types', value: '' },
              ...Object.values(STORE_TYPE).map((type) => ({
                label: STORE_TYPE_LABELS[type],
                value: type,
              })),
            ]}
            value={searchParams.get('storeType') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { page: 1, storeType: next || null });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Fulfillment"
            options={[
              { label: 'All fulfillment', value: '' },
              ...Object.values(FULFILLMENT_TYPE).map((type) => ({
                label: FULFILLMENT_TYPE_LABELS[type],
                value: type,
              })),
            ]}
            value={searchParams.get('fulfillmentType') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { fulfillmentType: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Open"
            options={[
              { label: 'Any', value: '' },
              { label: 'Open', value: 'true' },
              { label: 'Closed', value: 'false' },
            ]}
            value={searchParams.get('isOpen') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { isOpen: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Accepting orders"
            options={[
              { label: 'Any', value: '' },
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
            value={searchParams.get('isAcceptingOrders') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { isAcceptingOrders: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
        </div>
        {isLoading && !data ? <CatalogTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <CatalogEmptyState description="No stores match your filters." title="No stores" />
        ) : null}
        {rows.length > 0 ? (
          <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title={DELETE_CONFIRMATION.store}
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

type FilterSelectProps = {
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
};

function FilterSelect({ label, onChange, options, value }: FilterSelectProps) {
  const id = `${label.toLowerCase().replace(/\s+/g, '-')}-filter`;
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ borderRadius: 'var(--radius-md)', minWidth: 160, padding: 'var(--spacing-md)' }}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
