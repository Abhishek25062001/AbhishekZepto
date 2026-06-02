import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { StoreAuditTable } from '../../modules/vendor-stores/components/StoreAuditTable';
import { StoreInventoryTable } from '../../modules/vendor-stores/components/StoreInventoryTable';
import { StoreOrdersTable } from '../../modules/vendor-stores/components/StoreOrdersTable';
import { StoreStatusControl } from '../../modules/vendor-stores/components/StoreStatusControl';
import { StoreSummary } from '../../modules/vendor-stores/components/StoreSummary';
import { useAdminStoreAudit } from '../../modules/vendor-stores/hooks/useAdminStoreAudit';
import { useAdminStoreDetail } from '../../modules/vendor-stores/hooks/useAdminStoreDetail';
import { useAdminStoreInventory } from '../../modules/vendor-stores/hooks/useAdminStoreInventory';
import { useAdminStoreOrders } from '../../modules/vendor-stores/hooks/useAdminStoreOrders';
import type { AdminStoreInspectionQuery } from '../../modules/vendor-stores/types/admin-vendor-store.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

const STORE_STATUS_PERMISSIONS = ['stores:update', 'settings:manage'] as const;

export function AdminStoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [statusOpen, setStatusOpen] = useState(false);
  const [ordersQuery, setOrdersQuery] = useState<AdminStoreInspectionQuery>({ page: 1, limit: 20 });
  const [inventoryQuery, setInventoryQuery] = useState<AdminStoreInspectionQuery>({
    page: 1,
    limit: 20,
  });
  const [auditQuery, setAuditQuery] = useState<AdminStoreInspectionQuery>({ page: 1, limit: 20 });

  if (!storeId) {
    return <Navigate replace to="/stores" />;
  }

  const detailQuery = useAdminStoreDetail(storeId);
  const orders = useAdminStoreOrders(storeId, ordersQuery);
  const inventory = useAdminStoreInventory(storeId, inventoryQuery);
  const audit = useAdminStoreAudit(storeId, auditQuery);

  const orderItems = orders.data?.items ?? [];
  const inventoryItems = inventory.data?.items ?? [];
  const auditItems = audit.data?.items ?? [];
  const orderPagination = orders.data?.pagination;
  const inventoryPagination = inventory.data?.pagination;
  const auditPagination = audit.data?.pagination;

  if (detailQuery.isLoading) {
    return <Loader label="Loading store..." mode="page" />;
  }

  if (detailQuery.error) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load store.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load store"
      />
    );
  }

  if (!detailQuery.data) {
    return <Navigate replace to="/stores" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/stores">Back to stores</Link>
          <h1 style={{ marginBottom: 0 }}>Store Detail</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <CanAccessAny permissions={STORE_STATUS_PERMISSIONS}>
            <Button onClick={() => setStatusOpen(true)} type="button" variant="danger">
              Change Status
            </Button>
          </CanAccessAny>
          <Button onClick={() => {
            void detailQuery.refetch();
            void orders.refetch();
            void inventory.refetch();
            void audit.refetch();
          }} type="button" variant="outline">
            Refresh
          </Button>
        </div>
      </header>

      <StoreSummary store={detailQuery.data} />

      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2 style={{ margin: 0 }}>Store Orders</h2>
        {orders.error ? (
          <ErrorView
            message={getApiErrorMessage(orders.error, 'Unable to load store orders.')}
            onRetry={() => void orders.refetch()}
            title="Unable to load store orders"
          />
        ) : null}
        {!orders.error ? <StoreOrdersTable loading={orders.isLoading} orders={orderItems} /> : null}
        {!orders.isLoading && !orders.error && orderItems.length === 0 ? (
          <EmptyState description="No orders are available for this store." title="No orders found" />
        ) : null}
        {orderPagination ? (
          <InspectionPagination
            label="orders"
            onChange={setOrdersQuery}
            pagination={orderPagination}
          />
        ) : null}
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2 style={{ margin: 0 }}>Store Inventory</h2>
        {inventory.error ? (
          <ErrorView
            message={getApiErrorMessage(inventory.error, 'Unable to load store inventory.')}
            onRetry={() => void inventory.refetch()}
            title="Unable to load store inventory"
          />
        ) : null}
        {!inventory.error ? (
          <StoreInventoryTable inventory={inventoryItems} loading={inventory.isLoading} />
        ) : null}
        {!inventory.isLoading && !inventory.error && inventoryItems.length === 0 ? (
          <EmptyState
            description="No inventory records are available for this store."
            title="No inventory records found"
          />
        ) : null}
        {inventoryPagination ? (
          <InspectionPagination
            label="inventory records"
            onChange={setInventoryQuery}
            pagination={inventoryPagination}
          />
        ) : null}
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2 style={{ margin: 0 }}>Store Audit</h2>
        {audit.error ? (
          <ErrorView
            message={getApiErrorMessage(audit.error, 'Unable to load store audit.')}
            onRetry={() => void audit.refetch()}
            title="Unable to load store audit"
          />
        ) : null}
        {!audit.error ? <StoreAuditTable audit={auditItems} loading={audit.isLoading} /> : null}
        {!audit.isLoading && !audit.error && auditItems.length === 0 ? (
          <EmptyState
            description="No audit records are available for this store."
            title="No audit records found"
          />
        ) : null}
        {auditPagination ? (
          <InspectionPagination
            label="audit records"
            onChange={setAuditQuery}
            pagination={auditPagination}
          />
        ) : null}
      </section>

      <StoreStatusControl
        onClose={() => setStatusOpen(false)}
        open={statusOpen}
        store={detailQuery.data}
      />
    </div>
  );
}

function InspectionPagination({
  label,
  onChange,
  pagination,
}: {
  label: string;
  onChange: Dispatch<SetStateAction<AdminStoreInspectionQuery>>;
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    page: number;
    total: number;
    totalPages: number;
  };
}) {
  return (
    <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>
        Page {pagination.page} of {pagination.totalPages} · {pagination.total} {label}
      </span>
      <Button
        disabled={!pagination.hasPreviousPage}
        onClick={() => onChange(previous => ({
          ...previous,
          page: Math.max(1, (previous.page ?? 1) - 1),
        }))}
        size="sm"
        type="button"
        variant="outline"
      >
        Previous
      </Button>
      <Button
        disabled={!pagination.hasNextPage}
        onClick={() => onChange(previous => ({
          ...previous,
          page: (previous.page ?? 1) + 1,
        }))}
        size="sm"
        type="button"
        variant="outline"
      >
        Next
      </Button>
    </footer>
  );
}
