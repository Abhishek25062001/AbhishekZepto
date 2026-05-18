import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { InventoryMovementBadge } from '../../components/InventoryMovementBadge';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { useInventoryMovementDetail } from '../../hooks/useInventoryMovementDetail';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function InventoryMovementDetailPage() {
  const { movementId } = useParams<{ movementId: string }>();
  const detail = useInventoryMovementDetail(movementId);

  if (detail.isLoading || !movementId) {
    return <Loader label="Loading movement…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <InventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load movement.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link to="/inventory/movements">Back to movements</Link>
        <h1 style={{ marginBottom: 0, marginTop: 'var(--spacing-md)' }}>
          <InventoryMovementBadge movementType={record.movementType} />
        </h1>
      </header>
      <section
        style={{
          display: 'grid',
          gap: 'var(--spacing-md)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <DetailCard title="Movement summary">
          <DetailRow label="Quantity" value={record.quantity} />
          <DetailRow label="Reason" value={record.reason} />
          <DetailRow label="Notes" value={record.notes ?? '—'} />
        </DetailCard>
        <DetailCard title="Quantity changes">
          <DetailRow label="Available" value={`${record.previousAvailableQuantity} → ${record.newAvailableQuantity}`} />
          <DetailRow label="Reserved" value={`${record.previousReservedQuantity} → ${record.newReservedQuantity}`} />
          <DetailRow label="Total" value={`${record.previousTotalQuantity} → ${record.newTotalQuantity}`} />
        </DetailCard>
        <DetailCard title="Reference">
          <DetailRow label="Type" value={record.referenceType} />
          <DetailRow label="Reference ID" value={record.referenceId ?? '—'} />
          <DetailRow label="Stock ID" value={record.inventoryStockId} />
        </DetailCard>
        <DetailCard title="Metadata">
          <DetailRow label="Store ID" value={record.storeId} />
          <DetailRow label="Product ID" value={record.productId} />
          <DetailRow label="Variant ID" value={record.variantId} />
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
