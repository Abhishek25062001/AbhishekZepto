import { Badge } from '../../../components/common';
import type { AdminStoreSummary } from '../types/admin-vendor-store.types';
import {
  formatVendorStoreDate,
  formatVendorStoreLabel,
  getBooleanStatusVariant,
  getVendorStoreStatusVariant,
} from '../utils/admin-vendor-store-display.util';
import type { ReactNode } from 'react';

type StoreSummaryProps = {
  store: AdminStoreSummary;
};

const rowStyle = {
  display: 'grid',
  gap: 4,
} as const;

const labelStyle = {
  color: 'var(--color-text-secondary)',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
} as const;

function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function StoreSummary({ store }: StoreSummaryProps) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gap: 'var(--spacing-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        padding: 'var(--spacing-lg)',
      }}
    >
      <SummaryItem label="Name" value={<strong>{store.name}</strong>} />
      <SummaryItem label="Code" value={store.code} />
      <SummaryItem label="Slug" value={store.slug} />
      <SummaryItem label="Vendor ID" value={store.vendorId} />
      <SummaryItem label="City" value={store.cityId} />
      <SummaryItem label="Service Areas" value={store.serviceAreaIds.join(', ') || '—'} />
      <SummaryItem label="Phone" value={store.phone} />
      <SummaryItem label="Email" value={store.email ?? '—'} />
      <SummaryItem
        label="Status"
        value={(
          <Badge variant={getVendorStoreStatusVariant(store.status)}>
            {formatVendorStoreLabel(store.status)}
          </Badge>
        )}
      />
      <SummaryItem
        label="Open"
        value={(
          <Badge variant={getBooleanStatusVariant(store.isOpen)}>
            {store.isOpen ? 'Open' : 'Closed'}
          </Badge>
        )}
      />
      <SummaryItem
        label="Accepting Orders"
        value={(
          <Badge variant={getBooleanStatusVariant(store.isAcceptingOrders)}>
            {store.isAcceptingOrders ? 'Accepting' : 'Paused'}
          </Badge>
        )}
      />
      <SummaryItem label="Closure Reason" value={store.temporaryClosureReason ?? '—'} />
      <SummaryItem label="Address" value={`${store.addressLine1}, ${store.pincode}`} />
      <SummaryItem label="Landmark" value={store.landmark ?? '—'} />
      <SummaryItem label="Coordinates" value={`${store.latitude}, ${store.longitude}`} />
      <SummaryItem label="Service Radius" value={`${store.serviceRadiusKm} km`} />
      <SummaryItem label="Hours" value={`${store.openingTime} - ${store.closingTime}`} />
      <SummaryItem label="Operating Days" value={store.operatingDays.join(', ')} />
      <SummaryItem label="Store Type" value={formatVendorStoreLabel(store.storeType)} />
      <SummaryItem label="Fulfillment" value={formatVendorStoreLabel(store.fulfillmentType)} />
      <SummaryItem label="Created" value={formatVendorStoreDate(store.createdAt)} />
      <SummaryItem label="Updated" value={formatVendorStoreDate(store.updatedAt)} />
    </section>
  );
}
