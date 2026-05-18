import { Link, useNavigate, useParams } from 'react-router-dom';

import { VendorCatalogErrorState } from '../components/VendorCatalogErrorState';
import { VendorCatalogTableSkeleton } from '../components/VendorCatalogTableSkeleton';
import { VendorStoreProductPriceForm } from '../forms/VendorStoreProductPriceForm';
import { useVendorStoreProductDetail } from '../hooks/useVendorStoreProductDetail';
import { useVendorStoreProductMutations } from '../hooks/useVendorStoreProductMutations';
import {
  extractApiErrorCode,
  mapStoreProductErrorCodeToMessage,
} from '../utils/vendor-catalog-error-message.util';

export function VendorStoreProductPricePage() {
  const navigate = useNavigate();
  const { storeProductId } = useParams<{ storeProductId: string }>();
  const { data, error, isLoading, refetch } = useVendorStoreProductDetail(storeProductId);
  const { updatePrice } = useVendorStoreProductMutations();

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
        <Link to={`/store-products/${data.id}`}>← Store product</Link>
        <h1>Update price — {data.sku}</h1>
      </header>
      <VendorStoreProductPriceForm
        initial={data}
        loading={updatePrice.isPending}
        onSubmit={async (values) => {
          await updatePrice.mutateAsync({ storeProductId: data.id, payload: values });
          navigate(`/store-products/${data.id}`);
        }}
      />
    </section>
  );
}
