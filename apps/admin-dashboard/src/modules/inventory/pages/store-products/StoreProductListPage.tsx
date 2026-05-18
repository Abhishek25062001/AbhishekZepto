import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Modal, Table, type TableColumn } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { CatalogSearchInput } from '../../../catalog/components/CatalogSearchInput';
import { ConfirmDeleteDialog } from '../../../catalog/components/ConfirmDeleteDialog';
import { StoreSelect } from '../../../stores/components/StoreSelect';
import { InventoryEmptyState } from '../../components/InventoryEmptyState';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { InventoryTableSkeleton } from '../../components/InventoryTableSkeleton';
import { StoreProductStatusBadge } from '../../components/InventoryStatusBadge';
import {
  STORE_PRODUCT_STATUS,
  STORE_PRODUCT_STATUS_LABELS,
} from '../../constants/store-product.constants';
import { BulkStoreProductMapForm } from '../../forms/BulkStoreProductMapForm';
import { BulkStoreProductPriceForm } from '../../forms/BulkStoreProductPriceForm';
import { BulkStoreProductVisibilityForm } from '../../forms/BulkStoreProductVisibilityForm';
import { useStoreProductMutations } from '../../hooks/useStoreProductMutations';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import type { StoreProductResponse } from '../../types/store-product.types';
import {
  DELETE_CONFIRMATION,
  extractApiErrorCode,
  mapInventoryErrorCodeToMessage,
} from '../../utils/inventory-error-message.util';
import { setSearchParams } from '../../utils/inventory-query-param.util';

type StoreProductRow = StoreProductResponse & Record<string, unknown>;
type BulkModal = 'map' | 'price' | 'visibility' | null;

export function StoreProductListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useStoreProducts();
  const { bulkMapMutation, bulkPriceMutation, bulkVisibilityMutation, deleteMutation } =
    useStoreProductMutations();
  const [pendingDelete, setPendingDelete] = useState<StoreProductResponse | null>(null);
  const [bulkModal, setBulkModal] = useState<BulkModal>(null);

  const rows = useMemo(
    () => (data?.items ?? []).map((item) => ({ ...item } as StoreProductRow)),
    [data?.items],
  );

  const columns: TableColumn<StoreProductRow>[] = [
    { header: 'Store', key: 'storeId' },
    { header: 'Product', key: 'productId' },
    { header: 'Variant', key: 'variantId' },
    { header: 'SKU', key: 'sku' },
    { header: 'MRP', key: 'mrp', render: (row) => row.mrp },
    { header: 'Selling', key: 'sellingPrice', render: (row) => row.sellingPrice },
    { header: 'Final', key: 'finalPrice', render: (row) => row.finalPrice },
    { header: 'Available', key: 'isAvailable', render: (row) => (row.isAvailable ? 'Yes' : 'No') },
    { header: 'Visible', key: 'isVisible', render: (row) => (row.isVisible ? 'Yes' : 'No') },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StoreProductStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <RowActions
          editHref={`/store-products/${row.id}/edit`}
          onDelete={() => setPendingDelete(row)}
        />
      ),
    },
  ];

  if (error) {
    return (
      <>
        <CatalogPageHeader
          description="Map catalog variants to stores with localized pricing."
          primaryActionHref="/store-products/new"
          primaryActionLabel="Map product"
          requiredPermission="store_products:create"
          title="Store products"
        />
        <InventoryErrorState
          message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load store products.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Map catalog variants to stores with localized pricing."
        primaryActionHref="/store-products/new"
        primaryActionLabel="Map product"
        requiredPermission="store_products:create"
        title="Store products"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <CanAccess permission="store_products:bulk_update">
            <Button type="button" variant="outline" onClick={() => setBulkModal('map')}>
              Bulk map
            </Button>
            <Button type="button" variant="outline" onClick={() => setBulkModal('price')}>
              Bulk price
            </Button>
            <Button type="button" variant="outline" onClick={() => setBulkModal('visibility')}>
              Bulk visibility
            </Button>
          </CanAccess>
        </div>
        <CatalogSearchInput />
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <StoreSelect
            label="Store"
            value={searchParams.get('storeId') ?? undefined}
            onChange={(storeId) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { page: 1, storeId: storeId ?? null });
              setUrlSearchParams(params, { replace: true });
            }}
          />
          <div style={{ display: 'grid', gap: '6px' }}>
            <label htmlFor="store-product-status-filter">Status</label>
            <select
              id="store-product-status-filter"
              value={searchParams.get('status') ?? ''}
              onChange={(event) => {
                const params = new URLSearchParams(searchParams);
                setSearchParams(params, { page: 1, status: event.target.value || null });
                setUrlSearchParams(params, { replace: true });
              }}
              style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}
            >
              <option value="">All statuses</option>
              {Object.values(STORE_PRODUCT_STATUS).map((status) => (
                <option key={status} value={status}>
                  {STORE_PRODUCT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isLoading && !data ? <InventoryTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <InventoryEmptyState description="No store products match your filters." title="No mappings" />
        ) : null}
        {rows.length > 0 ? (
          <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title={DELETE_CONFIRMATION.storeProduct}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(pendingDelete.id).then(() => setPendingDelete(null));
        }}
      />
      <Modal
        footer={null}
        open={bulkModal === 'map'}
        title="Bulk map store products"
        onClose={() => setBulkModal(null)}
      >
        <BulkStoreProductMapForm
          loading={bulkMapMutation.isPending}
          onSubmit={async (payload) => {
            const result = await bulkMapMutation.mutateAsync(payload);
            return result;
          }}
        />
      </Modal>
      <Modal
        footer={null}
        open={bulkModal === 'price'}
        title="Bulk update prices"
        onClose={() => setBulkModal(null)}
      >
        <BulkStoreProductPriceForm
          loading={bulkPriceMutation.isPending}
          onSubmit={async (payload) => {
            const result = await bulkPriceMutation.mutateAsync(payload);
            return result;
          }}
        />
      </Modal>
      <Modal
        footer={null}
        open={bulkModal === 'visibility'}
        title="Bulk update visibility"
        onClose={() => setBulkModal(null)}
      >
        <BulkStoreProductVisibilityForm
          loading={bulkVisibilityMutation.isPending}
          onSubmit={async (payload) => {
            const result = await bulkVisibilityMutation.mutateAsync(payload);
            return result;
          }}
        />
      </Modal>
    </>
  );
}

function RowActions({ editHref, onDelete }: { editHref: string; onDelete: () => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
      <Link to={editHref}>Edit</Link>
      <CanAccess permission="store_products:delete">
        <Button size="sm" type="button" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </CanAccess>
    </div>
  );
}
