import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Badge, Button, Table, type TableColumn } from '../../../../components/common';
import { CanAccess } from '../../../../components/auth/CanAccess';
import { CATALOG_STATUS, CATALOG_STATUS_LABELS } from '../../constants/catalog-status.constants';
import {
  FOOD_TYPE,
  FOOD_TYPE_LABELS,
  PRODUCT_APPROVAL_STATUS,
  PRODUCT_APPROVAL_STATUS_LABELS,
  PRODUCT_TYPE,
  PRODUCT_TYPE_LABELS,
} from '../../constants/product.constants';
import { CatalogEmptyState } from '../../components/CatalogEmptyState';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { CatalogPagination } from '../../components/CatalogPagination';
import { CatalogSearchInput } from '../../components/CatalogSearchInput';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { CatalogTableSkeleton } from '../../components/CatalogTableSkeleton';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { ProductApprovalDialog } from '../../components/ProductApprovalDialog';
import { useProductMutations } from '../../hooks/useProductMutations';
import { useProducts } from '../../hooks/useProducts';
import type { ProductResponse } from '../../types/product.types';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';
import { setSearchParams } from '../../utils/catalog-query-param.util';

type ProductRow = ProductResponse & Record<string, unknown>;

const approvalVariant: Record<
  (typeof PRODUCT_APPROVAL_STATUS)[keyof typeof PRODUCT_APPROVAL_STATUS],
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  approved: 'success',
  archived: 'neutral',
  draft: 'neutral',
  pending_review: 'warning',
  rejected: 'error',
};

export function ProductListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useProducts();
  const { approvalMutation, deleteMutation } = useProductMutations();
  const [pendingDelete, setPendingDelete] = useState<ProductResponse | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<ProductResponse | null>(null);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as ProductRow)), [data?.items]);

  const columns: TableColumn<ProductRow>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Slug', key: 'slug' },
    {
      header: 'Approval',
      key: 'approvalStatus',
      render: (row) => (
        <Badge variant={approvalVariant[row.approvalStatus]}>
          {PRODUCT_APPROVAL_STATUS_LABELS[row.approvalStatus]}
        </Badge>
      ),
    },
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
          <Link to={`/catalog/products/${row.id}`}>View</Link>
          <CanAccess permission="catalog:update">
            <Link to={`/catalog/products/${row.id}/edit`}>Edit</Link>
          </CanAccess>
          <CanAccess permission="catalog:approve">
            <Button size="sm" type="button" variant="outline" onClick={() => setApprovalTarget(row)}>
              Approval
            </Button>
          </CanAccess>
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
          description="Search and manage products across your catalog."
          primaryActionHref="/catalog/products/new"
          primaryActionLabel="Create product"
          title="Products"
        />
        <CatalogErrorState
          message={mapCatalogErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load products.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Search and manage products across your catalog."
        primaryActionHref="/catalog/products/new"
        primaryActionLabel="Create product"
        title="Products"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <FilterSelect
            label="Catalog status"
            options={[
              { label: 'All catalog statuses', value: '' },
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
            label="Approval status"
            options={[
              { label: 'All approval states', value: '' },
              ...Object.values(PRODUCT_APPROVAL_STATUS).map((status) => ({
                label: PRODUCT_APPROVAL_STATUS_LABELS[status],
                value: status,
              })),
            ]}
            value={searchParams.get('approvalStatus') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { approvalStatus: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Food type"
            options={[
              { label: 'All food types', value: '' },
              ...Object.values(FOOD_TYPE).map((foodType) => ({
                label: FOOD_TYPE_LABELS[foodType],
                value: foodType,
              })),
            ]}
            value={searchParams.get('foodType') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { foodType: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Product type"
            options={[
              { label: 'All product types', value: '' },
              ...Object.values(PRODUCT_TYPE).map((productType) => ({
                label: PRODUCT_TYPE_LABELS[productType],
                value: productType,
              })),
            ]}
            value={searchParams.get('productType') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { productType: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Visibility"
            options={[
              { label: 'All visibility', value: '' },
              { label: 'Visible', value: 'true' },
              { label: 'Hidden', value: 'false' },
            ]}
            value={searchParams.get('isVisible') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { isVisible: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <FilterSelect
            label="Featured"
            options={[
              { label: 'All products', value: '' },
              { label: 'Featured only', value: 'true' },
              { label: 'Not featured', value: 'false' },
            ]}
            value={searchParams.get('isFeatured') ?? ''}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { isFeatured: next || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
        </div>
        {isLoading && !data ? <CatalogTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <CatalogEmptyState description="Create a simple product to start filling your storefront." />
        ) : null}
        {rows.length > 0 ? (
          <Table
            columns={columns}
            data={rows}
            emptyMessage="No products match your filters."
            loading={isFetching && Boolean(data)}
            rowKey="id"
          />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title="Delete this product?"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(pendingDelete.id).then(() => setPendingDelete(null));
        }}
      />
      <ProductApprovalDialog
        key={approvalTarget?.id ?? 'closed'}
        loading={approvalMutation.isPending}
        open={Boolean(approvalTarget)}
        productName={approvalTarget?.name ?? ''}
        onClose={() => setApprovalTarget(null)}
        onSubmit={async (values) => {
          if (!approvalTarget) {
            return;
          }
          await approvalMutation.mutateAsync({
            payload: {
              approvalStatus: values.approvalStatus,
              rejectionReason: values.rejectionReason,
            },
            productId: approvalTarget.id,
          });
          setApprovalTarget(null);
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
