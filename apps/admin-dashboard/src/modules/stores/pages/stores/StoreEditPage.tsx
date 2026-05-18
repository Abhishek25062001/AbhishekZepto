import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { StoreForm } from '../../forms/StoreForm';
import { useStoreDetail } from '../../hooks/useStoreDetail';
import { useStoreMutations } from '../../hooks/useStoreMutations';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function StoreEditPage() {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const detail = useStoreDetail(storeId);
  const { updateMutation } = useStoreMutations();

  if (detail.isLoading || !storeId) {
    return <Loader label="Loading store…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapStoreErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load store.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader
        description="Update store profile and operations."
        requiredPermission="stores:update"
        title="Edit store"
      />
      <StoreForm
        defaultValues={{
          addressLine1: record.addressLine1,
          addressLine2: record.addressLine2 ?? undefined,
          cityId: record.cityId,
          closingTime: record.closingTime,
          description: record.description ?? undefined,
          email: record.email ?? '',
          fulfillmentType: record.fulfillmentType,
          isAcceptingOrders: record.isAcceptingOrders,
          isOpen: record.isOpen,
          landmark: record.landmark ?? undefined,
          latitude: record.latitude,
          longitude: record.longitude,
          name: record.name,
          openingTime: record.openingTime,
          operatingDays: record.operatingDays,
          phone: record.phone,
          pincode: record.pincode,
          serviceAreaIds: record.serviceAreaIds,
          serviceRadiusKm: record.serviceRadiusKm,
          status: record.status,
          storeType: record.storeType,
          temporaryClosureReason: record.temporaryClosureReason ?? undefined,
          vendorId: record.vendorId,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ payload: values, storeId });
            navigate('/stores');
          } catch (error) {
            alert(mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to update store.'));
          }
        }}
      />
    </>
  );
}
