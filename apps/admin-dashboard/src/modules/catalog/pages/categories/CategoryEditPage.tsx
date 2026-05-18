import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { CategoryForm } from '../../forms/CategoryForm';
import { useCategoryDetail } from '../../hooks/useCategoryDetail';
import { useCategoryMutations } from '../../hooks/useCategoryMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function CategoryEditPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const detail = useCategoryDetail(categoryId);
  const { updateMutation } = useCategoryMutations();

  if (detail.isLoading || !categoryId) {
    return <Loader label="Loading category…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this category.',
        )}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader description="Update category information and visibility." title="Edit category" />
      <CategoryForm
        defaultValues={{
          bannerUrl: record.bannerUrl ?? '',
          description: record.description ?? '',
          displayOrder: record.displayOrder,
          iconUrl: record.iconUrl ?? '',
          isFeatured: record.isFeatured,
          isVisible: record.isVisible,
          name: record.name,
          parentCategoryId: record.parentCategoryId ?? '',
          status: record.status,
        }}
        excludeParentId={categoryId}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ categoryId, payload: values });
            navigate('/catalog/categories');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to update category. Please try again.',
              ),
            );
          }
        }}
      />
    </>
  );
}
