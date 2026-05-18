import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { StoreForm } from '../../forms/StoreForm';
import { useStoreMutations } from '../../hooks/useStoreMutations';
import { extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';

export function StoreCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useStoreMutations();

  return (
    <>
      <CatalogPageHeader
        description="Onboard a vendor store with operating settings."
        requiredPermission="stores:create"
        title="Create store"
      />
      <StoreForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create store'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/stores');
          } catch (error) {
            alert(mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to create store.'));
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating store…" /> : null}
    </>
  );
}
