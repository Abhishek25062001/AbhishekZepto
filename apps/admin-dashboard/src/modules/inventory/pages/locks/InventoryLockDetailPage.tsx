import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Badge, Loader } from '../../../../components/common';
import { LOCK_STATUS_LABELS, LOCK_TYPE_LABELS } from '../../constants/inventory.constants';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { useInventoryLockDetail } from '../../hooks/useInventoryLockDetail';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function InventoryLockDetailPage() {
  const { lockId } = useParams<{ lockId: string }>();
  const detail = useInventoryLockDetail(lockId);

  if (detail.isLoading || !lockId) {
    return <Loader label="Loading lock…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <InventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load lock.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link to="/inventory/locks">Back to locks</Link>
        <h1 style={{ marginBottom: 0, marginTop: 'var(--spacing-md)' }}>{record.lockToken}</h1>
      </header>
      <section
        style={{
          display: 'grid',
          gap: 'var(--spacing-md)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <DetailCard title="Lock summary">
          <DetailRow label="Type" value={LOCK_TYPE_LABELS[record.lockType]} />
          <DetailRow label="Status" value={<Badge variant="neutral">{LOCK_STATUS_LABELS[record.status]}</Badge>} />
          <DetailRow label="Quantity" value={record.quantity} />
          <DetailRow label="Expires" value={new Date(record.expiresAt).toLocaleString()} />
        </DetailCard>
        <DetailCard title="Customer / cart / order">
          <DetailRow label="Customer ID" value={record.customerId ?? '—'} />
          <DetailRow label="Cart ID" value={record.cartId ?? '—'} />
          <DetailRow label="Order ID" value={record.orderId ?? '—'} />
        </DetailCard>
        <DetailCard title="Stock linkage">
          <DetailRow label="Inventory stock" value={record.inventoryStockId} />
          <DetailRow label="Store product" value={record.storeProductId} />
          <DetailRow label="Product" value={record.productId} />
          <DetailRow label="Variant" value={record.variantId} />
        </DetailCard>
        <DetailCard title="Lifecycle">
          <DetailRow label="Released at" value={record.releasedAt ? new Date(record.releasedAt).toLocaleString() : '—'} />
          <DetailRow label="Confirmed at" value={record.confirmedAt ? new Date(record.confirmedAt).toLocaleString() : '—'} />
          <DetailRow label="Release reason" value={record.releaseReason ?? '—'} />
          <DetailRow label="Created" value={new Date(record.createdAt).toLocaleString()} />
        </DetailCard>
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
