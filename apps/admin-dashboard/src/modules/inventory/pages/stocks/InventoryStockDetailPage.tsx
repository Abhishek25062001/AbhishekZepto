import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Loader } from '../../../../components/common';
import { CanAccess } from '../../../../components/auth/CanAccess';
import { getAdminInventoryMovements } from '../../api/inventory-movement.api';
import { InventoryMovementBadge } from '../../components/InventoryMovementBadge';
import {
  InventoryStockStatusBadge,
  StockLevelBadge,
} from '../../components/InventoryStatusBadge';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { InventoryTableSkeleton } from '../../components/InventoryTableSkeleton';
import { useInventoryStockDetail } from '../../hooks/useInventoryStockDetail';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function InventoryStockDetailPage() {
  const { inventoryStockId } = useParams<{ inventoryStockId: string }>();
  const detail = useInventoryStockDetail(inventoryStockId);
  const movements = useQuery({
    enabled: Boolean(inventoryStockId),
    queryKey: ['admin-inventory-movements', { inventoryStockId, limit: 10 }],
    queryFn: () =>
      getAdminInventoryMovements({
        inventoryStockId,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });

  if (detail.isLoading || !inventoryStockId) {
    return <Loader label="Loading stock…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <InventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load stock.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <header
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-lg)',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{record.sku}</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
            Store product {record.storeProductId}
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to="/inventory/stocks">Back to list</Link>
          <CanAccess permission="inventory:update">
            <Link to={`/inventory/stocks/${record.id}/edit`}>Edit</Link>
          </CanAccess>
        </div>
      </header>
      <section
        style={{
          display: 'grid',
          gap: 'var(--spacing-md)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <DetailCard title="Stock summary">
          <DetailRow label="Status" value={<InventoryStockStatusBadge status={record.status} />} />
          <DetailRow
            label="Level"
            value={<StockLevelBadge isLowStock={record.isLowStock} isOutOfStock={record.isOutOfStock} />}
          />
          <DetailRow label="Store ID" value={record.storeId} />
        </DetailCard>
        <DetailCard title="Quantities">
          <DetailRow label="Available" value={record.availableQuantity} />
          <DetailRow label="Reserved" value={record.reservedQuantity} />
          <DetailRow label="Damaged" value={record.damagedQuantity} />
          <DetailRow label="Expired" value={record.expiredQuantity} />
          <DetailRow label="Total" value={record.totalQuantity} />
        </DetailCard>
        <DetailCard title="Thresholds">
          <DetailRow label="Low stock threshold" value={record.lowStockThreshold} />
          <DetailRow label="Reorder level" value={record.reorderLevel} />
        </DetailCard>
        <DetailCard title="Product mapping">
          <DetailRow label="Product ID" value={record.productId} />
          <DetailRow label="Variant ID" value={record.variantId} />
          <DetailRow label="Store SKU" value={record.storeSku ?? '—'} />
        </DetailCard>
      </section>
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Recent movements</h2>
        {movements.isLoading ? <InventoryTableSkeleton columns={4} /> : null}
        {!movements.isLoading && (movements.data?.items ?? []).length === 0 ? (
          <p>No recent movements for this stock record.</p>
        ) : null}
        <ul style={{ display: 'grid', gap: 'var(--spacing-sm)', listStyle: 'none', padding: 0 }}>
          {(movements.data?.items ?? []).map((movement) => (
            <li key={movement.id}>
              <Link to={`/inventory/movements/${movement.id}`}>
                <InventoryMovementBadge movementType={movement.movementType} /> · {movement.quantity} ·{' '}
                {new Date(movement.createdAt).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function DetailCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <article
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-lg)',
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {children}
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
