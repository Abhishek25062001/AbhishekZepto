import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { StoreProductForm } from '../../forms/StoreProductForm';
import { useStoreProductMutations } from '../../hooks/useStoreProductMutations';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function StoreProductCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useStoreProductMutations();

  return (
    <>
      <CatalogPageHeader
        description="Map a catalog variant to a store with pricing."
        requiredPermission="store_products:create"
        title="Map store product"
      />
      <StoreProductForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create mapping'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/store-products');
          } catch (error) {
            alert(mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to create mapping.'));
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating mapping…" /> : null}
    </>
  );
}
