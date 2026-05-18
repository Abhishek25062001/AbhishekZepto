import { Link } from 'react-router-dom';

import { Card, Table, type TableColumn } from '../../../components/common';
import { VendorCatalogErrorState } from '../components/VendorCatalogErrorState';
import { VendorCatalogTableSkeleton } from '../components/VendorCatalogTableSkeleton';
import { useVendorCatalogProductDetail } from '../hooks/useVendorCatalogProductDetail';
import { useVendorCatalogProductVariants } from '../hooks/useVendorCatalogFilters';
import type { VendorCatalogProductVariant } from '../types/vendor-catalog.types';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../utils/vendor-catalog-error-message.util';

type VariantRow = VendorCatalogProductVariant & Record<string, unknown>;

export function VendorCatalogProductDetailPage() {
  const { data: product, error, isLoading, refetch } = useVendorCatalogProductDetail();
  const variantsQuery = useVendorCatalogProductVariants(product?.id);

  if (error) {
    return (
      <VendorCatalogErrorState
        message={mapCatalogErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load product.')}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isLoading || !product) {
    return <VendorCatalogTableSkeleton />;
  }

  const variantColumns: TableColumn<VariantRow>[] = [
    { header: 'Variant', key: 'variantName' },
    { header: 'SKU', key: 'sku' },
    { header: 'Unit', key: 'unit' },
    { header: 'MRP', key: 'mrp' },
    { header: 'Default price', key: 'defaultSellingPrice' },
    { header: 'Status', key: 'status' },
  ];

  const variantRows = (variantsQuery.data ?? []).map((variant) => ({ ...variant } as VariantRow));

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <Link to="/store-catalog/products">← Products</Link>
        <h1>{product.name}</h1>
      </header>
      <Card title="Basic information">
        <p>{product.shortDescription ?? product.description ?? '—'}</p>
        <p>Slug: {product.slug}</p>
        <p>Type: {product.productType}</p>
      </Card>
      <Card title="Category & brand">
        <p>Category: {product.categoryId}</p>
        <p>Subcategory: {product.subcategoryId ?? '—'}</p>
        <p>Brand: {product.brandId ?? '—'}</p>
      </Card>
      <Card title="Images">
        {product.imageUrls.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
            {product.imageUrls.map((url) => (
              <img key={url} alt="" src={url} style={{ height: 80, objectFit: 'cover' }} />
            ))}
          </div>
        ) : (
          <p>No images</p>
        )}
      </Card>
      <Card title="Variants">
        {variantsQuery.isLoading ? (
          <VendorCatalogTableSkeleton columns={6} />
        ) : (
          <Table columns={variantColumns} data={variantRows} rowKey="id" />
        )}
      </Card>
      <Card title="Search metadata">
        <p>Keywords: {product.searchKeywords.join(', ') || '—'}</p>
        <p>Tags: {product.tags.join(', ') || '—'}</p>
      </Card>
    </section>
  );
}
