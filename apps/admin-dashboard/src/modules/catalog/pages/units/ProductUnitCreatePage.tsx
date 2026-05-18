import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { ProductUnitForm } from '../../forms/ProductUnitForm';
import { useProductUnitMutations } from '../../hooks/useProductUnitMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function ProductUnitCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useProductUnitMutations();

  return (
    <>
      <CatalogPageHeader description="Define a measurement unit with a stable code." title="Create unit" />
      <ProductUnitForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create unit'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/catalog/units');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to create unit. Please try again.',
              ),
            );
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating unit…" /> : null}
    </>
  );
}
