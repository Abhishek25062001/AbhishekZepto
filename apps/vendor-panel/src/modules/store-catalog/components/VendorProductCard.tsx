import { Link } from 'react-router-dom';

import { Card } from '../../../components/common';
import type { VendorCatalogProduct } from '../types/vendor-catalog.types';
import { VendorCatalogApprovalBadge } from './VendorCatalogStatusBadge';

type Props = {
  product: VendorCatalogProduct;
  categoryName?: string;
  brandName?: string;
};

export function VendorProductCard({ product, categoryName, brandName }: Props) {
  return (
    <Card>
      <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        {product.defaultImageUrl ? (
          <img
            alt={product.name}
            src={product.defaultImageUrl}
            style={{ borderRadius: 'var(--radius-md)', height: 120, objectFit: 'cover', width: '100%' }}
          />
        ) : null}
        <strong>{product.name}</strong>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {categoryName ?? product.categoryId}
          {brandName || product.brandId ? ` · ${brandName ?? product.brandId}` : ''}
        </p>
        <p style={{ margin: 0 }}>
          {product.productType}
          {product.foodType ? ` · ${product.foodType}` : ''}
        </p>
        <VendorCatalogApprovalBadge
          status={
            product.approvalStatus === 'approved' ||
            product.approvalStatus === 'pending_review' ||
            product.approvalStatus === 'rejected'
              ? product.approvalStatus
              : 'pending_review'
          }
        />
        <Link to={`/store-catalog/products/${product.id}`}>View details</Link>
      </div>
    </Card>
  );
}
