import type { ReactNode } from 'react';

import { Card } from '../../../components/common';
import type { VendorStoreProduct } from '../types/vendor-store-product.types';
import { VendorAvailabilityBadge, VendorCatalogStatusBadge } from './VendorCatalogStatusBadge';

export function VendorStoreProductAvailabilityCard({ storeProduct }: { storeProduct: VendorStoreProduct }) {
  return (
    <Card title="Availability">
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)', margin: 0 }}>
        <DetailRow label="Available">
          <VendorAvailabilityBadge isAvailable={storeProduct.isAvailable} />
        </DetailRow>
        <DetailRow label="Visible">{storeProduct.isVisible ? 'Yes' : 'No'}</DetailRow>
        <DetailRow label="Featured">{storeProduct.isFeatured ? 'Yes' : 'No'}</DetailRow>
        <DetailRow label="Status">
          <VendorCatalogStatusBadge status={storeProduct.status} />
        </DetailRow>
      </dl>
    </Card>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd style={{ margin: 0 }}>{children}</dd>
    </div>
  );
}

