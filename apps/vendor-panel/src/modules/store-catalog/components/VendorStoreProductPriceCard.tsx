import { Card } from '../../../components/common';
import { DISCOUNT_TYPE_LABELS } from '../constants/vendor-store-product.constants';
import type { VendorStoreProduct } from '../types/vendor-store-product.types';

export function VendorStoreProductPriceCard({ storeProduct }: { storeProduct: VendorStoreProduct }) {
  return (
    <Card title="Price">
      <dl style={{ display: 'grid', gap: 'var(--spacing-sm)', margin: 0 }}>
        <DetailRow label="MRP" value={String(storeProduct.mrp)} />
        <DetailRow label="Selling price" value={String(storeProduct.sellingPrice)} />
        <DetailRow
          label="Discount"
          value={`${DISCOUNT_TYPE_LABELS[storeProduct.discountType]} (${storeProduct.discountValue})`}
        />
        <DetailRow label="Final price" value={String(storeProduct.finalPrice)} />
        {storeProduct.isPriceLocked ? (
          <p style={{ color: 'var(--color-warning)', margin: 0 }}>Price is locked by admin.</p>
        ) : null}
      </dl>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}
