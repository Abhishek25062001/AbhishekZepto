import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { ServiceAreaForm } from '../../forms/ServiceAreaForm';
import { useServiceAreaDetail } from '../../hooks/useServiceAreaDetail';
import { useServiceAreaMutations } from '../../hooks/useServiceAreaMutations';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function ServiceAreaEditPage() {
  const navigate = useNavigate();
  const { serviceAreaId } = useParams<{ serviceAreaId: string }>();
  const detail = useServiceAreaDetail(serviceAreaId);
  const { updateMutation } = useServiceAreaMutations();

  if (detail.isLoading || !serviceAreaId) {
    return <Loader label="Loading service area…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapStoreErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load service area.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader
        description="Update service area settings."
        requiredPermission="locations:update"
        title="Edit service area"
      />
      <ServiceAreaForm
        defaultValues={{
          cityId: record.cityId,
          description: record.description ?? undefined,
          isServiceable: record.isServiceable,
          name: record.name,
          polygonJson: record.polygon ? JSON.stringify(record.polygon) : undefined,
          status: record.status,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ payload: values, serviceAreaId });
            navigate('/locations/service-areas');
          } catch (error) {
            alert(mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to update service area.'));
          }
        }}
      />
    </>
  );
}
