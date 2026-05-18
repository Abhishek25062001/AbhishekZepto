import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { ProductForm } from '../../forms/ProductForm';
import { useProductMutations } from '../../hooks/useProductMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function ProductCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useProductMutations();

  return (
    <>
      <CatalogPageHeader description="Define a merchandisable product without variant management." title="Create product" />
      <ProductForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create product'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/catalog/products');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to create product. Please try again.',
              ),
            );
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating product…" /> : null}
    </>
  );
}
