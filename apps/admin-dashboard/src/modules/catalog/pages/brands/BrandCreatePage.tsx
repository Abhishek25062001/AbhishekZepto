import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { BrandForm } from '../../forms/BrandForm';
import { useBrandMutations } from '../../hooks/useBrandMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function BrandCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useBrandMutations();

  return (
    <>
      <CatalogPageHeader description="Add a new brand that products can reference." title="Create brand" />
      <BrandForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create brand'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/catalog/brands');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to create brand. Please try again.',
              ),
            );
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating brand…" /> : null}
    </>
  );
}
