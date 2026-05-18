import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CategoryForm } from '../../forms/CategoryForm';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { useCategoryMutations } from '../../hooks/useCategoryMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function CategoryCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useCategoryMutations();

  return (
    <>
      <CatalogPageHeader description="Define a new category for your catalog." title="Create category" />
      <CategoryForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create category'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/catalog/categories');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to create category. Please try again.',
              ),
            );
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating category…" /> : null}
    </>
  );
}
