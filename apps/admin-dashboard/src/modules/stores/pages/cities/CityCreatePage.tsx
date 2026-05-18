import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CityForm } from '../../forms/CityForm';
import { useCityMutations } from '../../hooks/useCityMutations';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function CityCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useCityMutations();
  return (
    <>
      <CatalogPageHeader title="Create city" description="Add a serviceable city." requiredPermission="locations:create" />
      <CityForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create city'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/locations/cities');
          } catch (error) {
            alert(mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to create city.'));
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating city…" /> : null}
    </>
  );
}
