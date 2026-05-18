import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { ServiceAreaForm } from '../../forms/ServiceAreaForm';
import { useServiceAreaMutations } from '../../hooks/useServiceAreaMutations';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function ServiceAreaCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useServiceAreaMutations();

  return (
    <>
      <CatalogPageHeader
        description="Add a serviceable delivery zone."
        requiredPermission="locations:create"
        title="Create service area"
      />
      <ServiceAreaForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create service area'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/locations/service-areas');
          } catch (error) {
            alert(mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to create service area.'));
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating service area…" /> : null}
    </>
  );
}
