import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Card } from '../../../components/common';
import { VendorStoreProductAvailabilityCard } from '../components/VendorStoreProductAvailabilityCard';
import { VendorStoreProductPriceCard } from '../components/VendorStoreProductPriceCard';
import { VendorCatalogErrorState } from '../components/VendorCatalogErrorState';
import { VendorCatalogTableSkeleton } from '../components/VendorCatalogTableSkeleton';
import { useVendorStoreProductDetail } from '../hooks/useVendorStoreProductDetail';
import {
  extractApiErrorCode,
  mapStoreProductErrorCodeToMessage,
} from '../utils/vendor-catalog-error-message.util';

export function VendorStoreProductDetailPage() {
  const { storeProductId } = useParams<{ storeProductId: string }>();
  const { data, error, isLoading, refetch } = useVendorStoreProductDetail(storeProductId);

  if (error) {
    return (
      <VendorCatalogErrorState
        message={mapStoreProductErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load store product.')}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isLoading || !data) {
    return <VendorCatalogTableSkeleton />;
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <Link to="/store-products">← Store products</Link>
        <h1>{data.sku}</h1>
      </header>
      <Card title="Product linkage">
        <p>Product: {data.productId}</p>
        <p>Variant: {data.variantId}</p>
        <p>Store SKU: {data.storeSku ?? '—'}</p>
      </Card>
      <VendorStoreProductPriceCard storeProduct={data} />
      <VendorStoreProductAvailabilityCard storeProduct={data} />
      <Card title="Store scope">
        <p>Store: {data.storeId}</p>
        <p>Vendor: {data.vendorId}</p>
        <p>City: {data.cityId}</p>
      </Card>
      <Card title="System information">
        <p>Created: {data.createdAt}</p>
        <p>Updated: {data.updatedAt}</p>
        <Link to={`/inventory/stocks?storeProductId=${data.id}`}>View inventory stock</Link>
      </Card>
      <CanAccess permission="store_products:update">
        <ActionLinks id={data.id} locked={data.isPriceLocked} />
      </CanAccess>
    </section>
  );
}

function ActionLinks({ id, locked }: { id: string; locked: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
      {!locked ? <Link to={`/store-products/${id}/price`}>Edit price</Link> : <span>Price locked</span>}
      <Link to={`/store-products/${id}/availability`}>Edit availability</Link>
    </div>
  );
}
