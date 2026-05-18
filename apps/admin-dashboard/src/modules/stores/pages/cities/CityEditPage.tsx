import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CityForm } from '../../forms/CityForm';
import { useCityDetail } from '../../hooks/useCityDetail';
import { useCityMutations } from '../../hooks/useCityMutations';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function CityEditPage() {
  const navigate = useNavigate();
  const { cityId } = useParams<{ cityId: string }>();
  const detail = useCityDetail(cityId);
  const { updateMutation } = useCityMutations();
  if (detail.isLoading || !cityId) return <Loader label="Loading city…" mode="page" />;
  if (detail.error || !detail.data) {
    return <CatalogErrorState message={mapStoreErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load city.')} onRetry={() => void detail.refetch()} />;
  }
  const record = detail.data;
  return (
    <>
      <CatalogPageHeader title="Edit city" description="Update city settings." requiredPermission="locations:update" />
      <CityForm
        defaultValues={{
          country: record.country,
          currencyCode: record.currencyCode,
          isServiceable: record.isServiceable,
          name: record.name,
          serviceRadiusKm: record.serviceRadiusKm ?? undefined,
          state: record.state,
          status: record.status,
          timezone: record.timezone,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ cityId, payload: values });
            navigate('/locations/cities');
          } catch (error) {
            alert(mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to update city.'));
          }
        }}
      />
    </>
  );
}
