import { Badge } from '../../../components/common';
import type { ReactNode } from 'react';
import type { AdminVendorSummary } from '../types/admin-vendor-store.types';
import {
  formatVendorStoreDate,
  formatVendorStoreLabel,
  getVendorStoreStatusVariant,
} from '../utils/admin-vendor-store-display.util';

type VendorSummaryProps = {
  vendor: AdminVendorSummary;
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

export function VendorSummary({ vendor }: VendorSummaryProps) {
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
      <SummaryItem label="Name" value={<strong>{vendor.name ?? 'Unnamed vendor'}</strong>} />
      <SummaryItem label="Phone" value={vendor.phone ?? '—'} />
      <SummaryItem label="Email" value={vendor.email ?? '—'} />
      <SummaryItem label="Vendor ID" value={vendor.vendorId} />
      <SummaryItem label="Primary User" value={vendor.primaryVendorUserId ?? '—'} />
      <SummaryItem label="Store ID" value={vendor.storeId ?? '—'} />
      <SummaryItem label="City" value={vendor.cityId ?? '—'} />
      <SummaryItem
        label="Status"
        value={(
          <Badge variant={getVendorStoreStatusVariant(vendor.accountStatus)}>
            {vendor.accountStatus ? formatVendorStoreLabel(vendor.accountStatus) : '—'}
          </Badge>
        )}
      />
      <SummaryItem label="Users" value={vendor.userCount} />
      <SummaryItem label="Stores" value={vendor.storeCount} />
      <SummaryItem label="Created" value={formatVendorStoreDate(vendor.createdAt)} />
      <SummaryItem label="Updated" value={formatVendorStoreDate(vendor.updatedAt)} />
    </section>
  );
}
