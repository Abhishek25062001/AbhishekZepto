import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Table, type TableColumn } from '../../../../components/common';
import { CATALOG_STATUS, CATALOG_STATUS_LABELS } from '../../constants/catalog-status.constants';
import { CatalogEmptyState } from '../../components/CatalogEmptyState';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { CatalogPagination } from '../../components/CatalogPagination';
import { CatalogSearchInput } from '../../components/CatalogSearchInput';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { CatalogTableSkeleton } from '../../components/CatalogTableSkeleton';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { useBrandMutations } from '../../hooks/useBrandMutations';
import { useBrands } from '../../hooks/useBrands';
import type { BrandResponse } from '../../types/brand.types';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';
import { setSearchParams } from '../../utils/catalog-query-param.util';

type BrandRow = BrandResponse & Record<string, unknown>;

export function BrandListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useBrands();
  const { deleteMutation } = useBrandMutations();
  const [pendingDelete, setPendingDelete] = useState<BrandResponse | null>(null);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as BrandRow)), [data?.items]);

  const columns: TableColumn<BrandRow>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Slug', key: 'slug' },
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
          <Link to={`/catalog/brands/${row.id}/edit`}>Edit</Link>
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
          description="Maintain brand records displayed across catalog surfaces."
          primaryActionHref="/catalog/brands/new"
          primaryActionLabel="Create brand"
          title="Brands"
        />
        <CatalogErrorState
          message={mapCatalogErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load brands.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Maintain brand records displayed across catalog surfaces."
        primaryActionHref="/catalog/brands/new"
        primaryActionLabel="Create brand"
        title="Brands"
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
        </div>
        {isLoading && !data ? <CatalogTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <CatalogEmptyState description="Brands help group products under recognizable labels." />
        ) : null}
        {rows.length > 0 ? (
          <Table
            columns={columns}
            data={rows}
            emptyMessage="No brands match your filters."
            loading={isFetching && Boolean(data)}
            rowKey="id"
          />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title="Delete this brand?"
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
