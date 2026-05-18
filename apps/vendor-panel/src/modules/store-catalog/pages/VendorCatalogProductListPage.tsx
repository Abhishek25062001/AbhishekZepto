import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import { VendorCatalogApprovalBadge } from '../components/VendorCatalogStatusBadge';
import { VendorCatalogEmptyState } from '../components/VendorCatalogEmptyState';
import { VendorCatalogErrorState } from '../components/VendorCatalogErrorState';
import { VendorCatalogPagination } from '../components/VendorCatalogPagination';
import { VendorCatalogSearchInput } from '../components/VendorCatalogSearchInput';
import { VendorCatalogTableSkeleton } from '../components/VendorCatalogTableSkeleton';
import { useVendorCatalogFacets } from '../hooks/useVendorCatalogFacets';
import { useVendorCatalogFilters } from '../hooks/useVendorCatalogFilters';
import { useVendorCatalogProducts } from '../hooks/useVendorCatalogProducts';
import type { VendorCatalogProduct } from '../types/vendor-catalog.types';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../utils/vendor-catalog-error-message.util';
import { setSearchParams } from '../utils/vendor-catalog-query-param.util';

type Row = VendorCatalogProduct & Record<string, unknown>;

export function VendorCatalogProductListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useVendorCatalogProducts();
  const { brands, categories } = useVendorCatalogFilters();
  const facetsQuery = useVendorCatalogFacets();
  const categoryCounts = new Map(
    (facetsQuery.data?.categories ?? []).map((bucket) => [bucket.id, bucket.count]),
  );
  const brandCounts = new Map(
    (facetsQuery.data?.brands ?? []).map((bucket) => [bucket.id, bucket.count]),
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const brandMap = useMemo(() => new Map(brands.map((brand) => [brand.id, brand.name])), [brands]);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as Row)), [data?.items]);

  const columns: TableColumn<Row>[] = [
    {
      header: 'Image',
      key: 'defaultImageUrl',
      render: (row) =>
        row.defaultImageUrl ? (
          <img alt="" src={row.defaultImageUrl} style={{ height: 40, objectFit: 'cover', width: 40 }} />
        ) : (
          '—'
        ),
    },
    { header: 'Product', key: 'name' },
    {
      header: 'Category',
      key: 'categoryId',
      render: (row) => categoryMap.get(row.categoryId) ?? row.categoryId,
    },
    {
      header: 'Brand',
      key: 'brandId',
      render: (row) => (row.brandId ? (brandMap.get(row.brandId) ?? row.brandId) : '—'),
    },
    { header: 'Type', key: 'productType' },
    { header: 'Food', key: 'foodType', render: (row) => row.foodType ?? '—' },
    {
      header: 'Status',
      key: 'approvalStatus',
      render: (row) =>
        row.approvalStatus === 'approved' ||
        row.approvalStatus === 'pending_review' ||
        row.approvalStatus === 'rejected' ? (
          <VendorCatalogApprovalBadge status={row.approvalStatus} />
        ) : (
          row.approvalStatus
        ),
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => <Link to={`/store-catalog/products/${row.id}`}>View</Link>,
    },
  ];

  if (error) {
    return (
      <VendorCatalogErrorState
        message={mapCatalogErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load products.')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>Store catalog</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Browse approved global products (read-only).</p>
      </header>
      <VendorCatalogSearchInput placeholder="Search products" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <FilterSelect
          label="Category"
          options={categories.map((c) => ({
            label: categoryCounts.has(c.id) ? `${c.name} (${categoryCounts.get(c.id)})` : c.name,
            value: c.id,
          }))}
          paramKey="categoryId"
          searchParams={searchParams}
          setUrlSearchParams={setUrlSearchParams}
        />
        <FilterSelect
          label="Brand"
          options={brands.map((b) => ({
            label: brandCounts.has(b.id) ? `${b.name} (${brandCounts.get(b.id)})` : b.name,
            value: b.id,
          }))}
          paramKey="brandId"
          searchParams={searchParams}
          setUrlSearchParams={setUrlSearchParams}
        />
      </div>
      {isLoading && !data ? <VendorCatalogTableSkeleton columns={columns.length} /> : null}
      {!isLoading && rows.length === 0 ? (
        <VendorCatalogEmptyState description="No products match your filters." title="No products" />
      ) : null}
      {rows.length > 0 ? (
        <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
      ) : null}
      <VendorCatalogPagination pagination={data?.pagination} />
    </section>
  );
}

function FilterSelect({
  label,
  options,
  paramKey,
  searchParams,
  setUrlSearchParams,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  paramKey: string;
  searchParams: URLSearchParams;
  setUrlSearchParams: ReturnType<typeof useSearchParams>[1];
}) {
  return (
    <label style={{ display: 'grid', gap: '6px' }}>
      {label}
      <select
        value={searchParams.get(paramKey) ?? ''}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams);
          setSearchParams(params, { page: 1, [paramKey]: event.target.value || null });
          setUrlSearchParams(params, { replace: true });
        }}
        style={{ padding: 'var(--spacing-sm)' }}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
