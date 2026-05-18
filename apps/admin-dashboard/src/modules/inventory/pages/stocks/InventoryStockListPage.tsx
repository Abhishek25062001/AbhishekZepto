import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Modal, Table, type TableColumn } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { CatalogSearchInput } from '../../../catalog/components/CatalogSearchInput';
import { ConfirmDeleteDialog } from '../../../catalog/components/ConfirmDeleteDialog';
import { StoreSelect } from '../../../stores/components/StoreSelect';
import {
  InventoryStockStatusBadge,
  StockLevelBadge,
} from '../../components/InventoryStatusBadge';
import { InventoryEmptyState } from '../../components/InventoryEmptyState';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { InventoryTableSkeleton } from '../../components/InventoryTableSkeleton';
import { BulkInventoryThresholdForm } from '../../forms/BulkInventoryThresholdForm';
import { BulkInventoryUploadForm } from '../../forms/BulkInventoryUploadForm';
import { InventoryAdjustmentForm } from '../../forms/InventoryAdjustmentForm';
import { useInventoryStockMutations } from '../../hooks/useInventoryStockMutations';
import { useInventoryStocks } from '../../hooks/useInventoryStocks';
import type { InventoryStockResponse } from '../../types/inventory-stock.types';
import {
  DELETE_CONFIRMATION,
  extractApiErrorCode,
  mapInventoryErrorCodeToMessage,
} from '../../utils/inventory-error-message.util';
import { setSearchParams } from '../../utils/inventory-query-param.util';

type StockRow = InventoryStockResponse & Record<string, unknown>;
type BulkModal = 'upload' | 'thresholds' | null;

export function InventoryStockListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useInventoryStocks();
  const {
    adjustMutation,
    bulkThresholdsMutation,
    bulkUploadMutation,
    deleteMutation,
  } = useInventoryStockMutations();
  const [pendingDelete, setPendingDelete] = useState<InventoryStockResponse | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<InventoryStockResponse | null>(null);
  const [bulkModal, setBulkModal] = useState<BulkModal>(null);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as StockRow)), [data?.items]);

  const columns: TableColumn<StockRow>[] = [
    { header: 'SKU', key: 'sku' },
    { header: 'Store', key: 'storeId' },
    { header: 'Available', key: 'availableQuantity' },
    { header: 'Reserved', key: 'reservedQuantity' },
    { header: 'Total', key: 'totalQuantity' },
    {
      header: 'Level',
      key: 'isLowStock',
      render: (row) => (
        <StockLevelBadge isLowStock={row.isLowStock} isOutOfStock={row.isOutOfStock} />
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <InventoryStockStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <RowActions
          onAdjust={() => setAdjustTarget(row)}
          onDelete={() => setPendingDelete(row)}
          stockId={row.id}
        />
      ),
    },
  ];

  if (error) {
    return (
      <>
        <CatalogPageHeader
          description="Track on-hand, reserved, and damaged quantities per store product."
          primaryActionHref="/inventory/stocks/new"
          primaryActionLabel="Create stock"
          requiredPermission="inventory:create"
          title="Inventory stock"
        />
        <InventoryErrorState
          message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load stock.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader
        description="Track on-hand, reserved, and damaged quantities per store product."
        primaryActionHref="/inventory/stocks/new"
        primaryActionLabel="Create stock"
        requiredPermission="inventory:create"
        title="Inventory stock"
      />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <CanAccess permission="inventory:bulk_update">
            <Button type="button" variant="outline" onClick={() => setBulkModal('upload')}>
              Bulk upload
            </Button>
            <Button type="button" variant="outline" onClick={() => setBulkModal('thresholds')}>
              Bulk thresholds
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
        </div>
        {isLoading && !data ? <InventoryTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <InventoryEmptyState description="No stock records match your filters." title="No stock" />
        ) : null}
        {rows.length > 0 ? (
          <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog
        loading={deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title={DELETE_CONFIRMATION.inventoryStock}
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
        open={Boolean(adjustTarget)}
        title="Adjust stock"
        onClose={() => setAdjustTarget(null)}
      >
        {adjustTarget ? (
          <InventoryAdjustmentForm
            submitLabel={adjustMutation.isPending ? 'Adjusting…' : 'Submit adjustment'}
            onSubmit={async (values) => {
              await adjustMutation.mutateAsync({
                inventoryStockId: adjustTarget.id,
                payload: values,
              });
              setAdjustTarget(null);
            }}
          />
        ) : null}
      </Modal>
      <Modal footer={null} open={bulkModal === 'upload'} title="Bulk upload stock" onClose={() => setBulkModal(null)}>
        <BulkInventoryUploadForm
          loading={bulkUploadMutation.isPending}
          onSubmit={(payload) => bulkUploadMutation.mutateAsync(payload)}
        />
      </Modal>
      <Modal
        footer={null}
        open={bulkModal === 'thresholds'}
        title="Bulk update thresholds"
        onClose={() => setBulkModal(null)}
      >
        <BulkInventoryThresholdForm
          loading={bulkThresholdsMutation.isPending}
          onSubmit={(payload) => bulkThresholdsMutation.mutateAsync(payload)}
        />
      </Modal>
    </>
  );
}

function RowActions({
  stockId,
  onAdjust,
  onDelete,
}: {
  stockId: string;
  onAdjust: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
      <Link to={`/inventory/stocks/${stockId}`}>View</Link>
      <Link to={`/inventory/stocks/${stockId}/edit`}>Edit</Link>
      <CanAccess permission="inventory:adjust">
        <Button size="sm" type="button" variant="outline" onClick={onAdjust}>
          Adjust
        </Button>
      </CanAccess>
      <CanAccess permission="inventory:delete">
        <Button size="sm" type="button" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </CanAccess>
    </div>
  );
}
