import { Link, useNavigate, useParams } from 'react-router-dom';

import { VendorCatalogErrorState } from '../components/VendorCatalogErrorState';
import { VendorCatalogTableSkeleton } from '../components/VendorCatalogTableSkeleton';
import { VendorStoreProductAvailabilityForm } from '../forms/VendorStoreProductAvailabilityForm';
import { useVendorStoreProductDetail } from '../hooks/useVendorStoreProductDetail';
import { useVendorStoreProductMutations } from '../hooks/useVendorStoreProductMutations';
import {
  extractApiErrorCode,
  mapStoreProductErrorCodeToMessage,
} from '../utils/vendor-catalog-error-message.util';

export function VendorStoreProductAvailabilityPage() {
  const navigate = useNavigate();
  const { storeProductId } = useParams<{ storeProductId: string }>();
  const { data, error, isLoading, refetch } = useVendorStoreProductDetail(storeProductId);
  const { updateAvailability } = useVendorStoreProductMutations();

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
        <h1>Update availability — {data.sku}</h1>
      </header>
      <VendorStoreProductAvailabilityForm
        initial={data}
        loading={updateAvailability.isPending}
        onSubmit={async (values) => {
          await updateAvailability.mutateAsync({ storeProductId: data.id, payload: values });
          navigate(`/store-products/${data.id}`);
        }}
      />
    </section>
  );
}
