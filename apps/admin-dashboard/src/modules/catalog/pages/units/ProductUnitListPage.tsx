import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Table, type TableColumn } from '../../../../components/common';
import { CATALOG_STATUS, CATALOG_STATUS_LABELS } from '../../constants/catalog-status.constants';
import { BASE_UNIT, BASE_UNIT_LABELS } from '../../constants/product-unit.constants';
import { CatalogEmptyState } from '../../components/CatalogEmptyState';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { CatalogPagination } from '../../components/CatalogPagination';
import { CatalogSearchInput } from '../../components/CatalogSearchInput';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { CatalogTableSkeleton } from '../../components/CatalogTableSkeleton';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { useProductUnitMutations } from '../../hooks/useProductUnitMutations';
import { useProductUnits } from '../../hooks/useProductUnits';
import type { ProductUnitResponse } from '../../types/product-unit.types';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';
import { setSearchParams } from '../../utils/catalog-query-param.util';

type UnitRow = ProductUnitResponse & Record<string, unknown>;

export function ProductUnitListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useProductUnits();
  const { deleteMutation } = useProductUnitMutations();
  const [pendingDelete, setPendingDelete] = useState<ProductUnitResponse | null>(null);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as UnitRow)), [data?.items]);

  const columns: TableColumn<UnitRow>[] = [
    { header: 'Code', key: 'code' },
    { header: 'Name', key: 'name' },
    {
      header: 'Base unit',
      key: 'baseUnit',
      render: (row) => BASE_UNIT_LABELS[row.baseUnit],
    },
    { header: 'Factor', key: 'conversionFactor' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <CatalogStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to={`/catalog/units/${row.id}/edit`}>Edit</Link>
          <CanAccess permission="catalog:delete">
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
          description="Manage measurable units referenced by products."
          primaryActionHref="/catalog/units/new"
          primaryActionLabel="Create unit"
          title="Product units"
        />
        <CatalogErrorState
          message={mapCatalogErrorCodeToMessage(
            extractApiErrorCode(error),
            'Unable to load product units.',
          )}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Manage measurable units referenced by products."
        primaryActionHref="/catalog/units/new"
        primaryActionLabel="Create unit"
        title="Product units"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <FilterSelect
            label="Status"
            options={[
              { label: 'All statuses', value: '' },
              ...Object.values(CATALOG_STATUS).map((status) => ({
                label: CATALOG_STATUS_LABELS[status],
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
            label="Base unit"
            options={[
              { label: 'All base units', value: '' },
              ...Object.values(BASE_UNIT).map((unit) => ({
                label: BASE_UNIT_LABELS[unit],
                value: unit,
              })),
            ]}
            value={searchParams.get('baseUnit') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { baseUnit: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
        </div>
        {isLoading && !data ? <CatalogTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <CatalogEmptyState description="Units encode pack sizes and conversions for catalog items." />
        ) : null}
        {rows.length > 0 ? (
          <Table
            columns={columns}
            data={rows}
            emptyMessage="No units match your filters."
            loading={isFetching && Boolean(data)}
            rowKey="id"
          />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title="Delete this unit?"
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
        style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}
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
