import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { StoreProductForm } from '../../forms/StoreProductForm';
import { useStoreProductDetail } from '../../hooks/useStoreProductDetail';
import { useStoreProductMutations } from '../../hooks/useStoreProductMutations';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function StoreProductEditPage() {
  const navigate = useNavigate();
  const { storeProductId } = useParams<{ storeProductId: string }>();
  const detail = useStoreProductDetail(storeProductId);
  const { updateMutation } = useStoreProductMutations();

  if (detail.isLoading || !storeProductId) {
    return <Loader label="Loading mapping…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <InventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load mapping.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader
        description="Update store product pricing and visibility."
        requiredPermission="store_products:update"
        title="Edit store product"
      />
      <StoreProductForm
        defaultValues={{
          discountType: record.discountType,
          discountValue: record.discountValue,
          isAvailable: record.isAvailable,
          isFeatured: record.isFeatured,
          isVisible: record.isVisible,
          mrp: record.mrp,
          productId: record.productId,
          sellingPrice: record.sellingPrice,
          status: record.status,
          storeId: record.storeId,
          storeSku: record.storeSku ?? undefined,
          variantId: record.variantId,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ payload: values, storeProductId });
            navigate('/store-products');
          } catch (error) {
            alert(mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to update mapping.'));
          }
        }}
      />
    </>
  );
}
