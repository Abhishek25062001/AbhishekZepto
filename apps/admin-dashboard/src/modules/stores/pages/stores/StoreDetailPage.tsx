import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CanAccess } from '../../../../components/auth/CanAccess';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { StoreOpenBadge, StoreStatusBadge } from '../../components/StoreStatusBadge';
import {
  FULFILLMENT_TYPE_LABELS,
  STORE_TYPE_LABELS,
} from '../../constants/store.constants';
import { useStoreDetail } from '../../hooks/useStoreDetail';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const detail = useStoreDetail(storeId);

  if (detail.isLoading || !storeId) {
    return <Loader label="Loading store…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapStoreErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load store.')}
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
          <h1 style={{ margin: 0 }}>{record.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
            {record.code} · {STORE_TYPE_LABELS[record.storeType]}
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to="/stores">Back to list</Link>
          <CanAccess permission="stores:update">
            <Link to={`/stores/${record.id}/edit`}>Edit</Link>
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
        <DetailCard title="Identity">
          <DetailRow label="Vendor ID" value={record.vendorId} />
          <DetailRow label="Slug" value={record.slug} />
          <DetailRow label="Status" value={<StoreStatusBadge status={record.status} />} />
          <DetailRow label="Description" value={record.description ?? '—'} />
        </DetailCard>
        <DetailCard title="Address & location">
          <DetailRow label="City ID" value={record.cityId} />
          <DetailRow label="Address" value={record.addressLine1} />
          <DetailRow label="Pincode" value={record.pincode} />
          <DetailRow label="Coordinates" value={`${record.latitude}, ${record.longitude}`} />
          <DetailRow label="Service radius (km)" value={record.serviceRadiusKm} />
        </DetailCard>
        <DetailCard title="Operations">
          <DetailRow label="Open" value={<StoreOpenBadge isOpen={record.isOpen} />} />
          <DetailRow label="Accepting orders" value={record.isAcceptingOrders ? 'Yes' : 'No'} />
          <DetailRow label="Hours" value={`${record.openingTime} – ${record.closingTime}`} />
          <DetailRow label="Operating days" value={record.operatingDays.join(', ')} />
          <DetailRow
            label="Fulfillment"
            value={FULFILLMENT_TYPE_LABELS[record.fulfillmentType]}
          />
          <DetailRow label="Closure reason" value={record.temporaryClosureReason ?? '—'} />
        </DetailCard>
        <DetailCard title="Service areas">
          <DetailRow label="Linked areas" value={record.serviceAreaIds.join(', ') || '—'} />
        </DetailCard>
        <DetailCard title="System information">
          <DetailRow label="Phone" value={record.phone} />
          <DetailRow label="Email" value={record.email ?? '—'} />
          <DetailRow label="Created" value={new Date(record.createdAt).toLocaleString()} />
          <DetailRow label="Updated" value={new Date(record.updatedAt).toLocaleString()} />
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
