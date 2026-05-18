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
import { useCategories } from '../../hooks/useCategories';
import { useCategoryMutations } from '../../hooks/useCategoryMutations';
import type { CategoryResponse } from '../../types/category.types';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';
import { setSearchParams } from '../../utils/catalog-query-param.util';

type CategoryRow = CategoryResponse & Record<string, unknown>;

export function CategoryListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useCategories();
  const { deleteMutation } = useCategoryMutations();
  const [pendingDelete, setPendingDelete] = useState<CategoryResponse | null>(null);

  const rows = useMemo(
    () => (data?.items ?? []).map((item) => ({ ...item } as CategoryRow)),
    [data?.items],
  );

  const columns: TableColumn<CategoryRow>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Slug', key: 'slug' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <CatalogStatusBadge status={row.status} />,
    },
    {
      header: 'Featured',
      key: 'isFeatured',
      render: (row) => (row.isFeatured ? 'Yes' : 'No'),
    },
    {
      header: 'Visible',
      key: 'isVisible',
      render: (row) => (row.isVisible ? 'Yes' : 'No'),
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to={`/catalog/categories/${row.id}/edit`}>Edit</Link>
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
          description="Manage catalog categories, visibility, and hierarchy."
          primaryActionHref="/catalog/categories/new"
          primaryActionLabel="Create category"
          title="Categories"
        />
        <CatalogErrorState
          message={mapCatalogErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load categories.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Manage catalog categories, visibility, and hierarchy."
        primaryActionHref="/catalog/categories/new"
        primaryActionLabel="Create category"
        title="Categories"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <FilterRow
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
          <CatalogEmptyState description="Create a category to start organizing products." />
        ) : null}
        {rows.length > 0 ? (
          <Table
            columns={columns}
            data={rows}
            emptyMessage="No categories match your filters."
            loading={isFetching && Boolean(data)}
            rowKey="id"
          />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title="Delete this category?"
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

type FilterRowProps = {
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
};

function FilterRow({ label, onChange, options, value }: FilterRowProps) {
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
