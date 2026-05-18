import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Loader, Table, type TableColumn } from '../../../../components/common';
import { getAdminProductVariants, type ProductVariantOption } from '../../api/product.api';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { useProductDetail } from '../../hooks/useProductDetail';

export function VariantListPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = useProductDetail(productId);
  const [variants, setVariants] = useState<ProductVariantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!productId) {
      return;
    }

    setLoading(true);
    void getAdminProductVariants(productId)
      .then(setVariants)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [productId]);

  const columns: TableColumn<ProductVariantOption>[] = [
    { header: 'SKU', key: 'sku' },
    { header: 'Name', key: 'name' },
    { header: 'Status', key: 'status' },
  ];

  if (product.isLoading || loading) {
    return <Loader label="Loading variants…" mode="page" />;
  }

  if (error || !productId) {
    return (
      <CatalogErrorState
        message="Unable to load product variants."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ margin: 0 }}>Variants — {product.data?.name ?? productId}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <Link to={`/catalog/products/${productId}`}>Back to product</Link>
        </div>
      </header>
      <Table columns={columns} data={variants} emptyMessage="No variants for this product." rowKey="id" />
    </div>
  );
}
