import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { ProductForm } from '../../forms/ProductForm';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useProductMutations } from '../../hooks/useProductMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const detail = useProductDetail(productId);
  const { updateMutation } = useProductMutations();

  if (detail.isLoading || !productId) {
    return <Loader label="Loading product…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this product.',
        )}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader description="Update merchandising content for this product." title="Edit product" />
      <ProductForm
        defaultValues={{
          brandId: record.brandId ?? '',
          categoryId: record.categoryId,
          defaultImageUrl: record.defaultImageUrl ?? '',
          description: record.description ?? '',
          foodType: record.foodType ?? undefined,
          hsnCode: record.hsnCode ?? '',
          isFeatured: record.isFeatured,
          isVisible: record.isVisible,
          name: record.name,
          productType: record.productType,
          searchKeywords: record.searchKeywords ?? [],
          shortDescription: record.shortDescription ?? '',
          status: record.status,
          subcategoryId: record.subcategoryId ?? '',
          tags: record.tags ?? [],
          taxCategoryId: record.taxCategoryId ?? '',
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ payload: values, productId });
            navigate(`/catalog/products/${productId}`);
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to update product. Please try again.',
              ),
            );
          }
        }}
      />
    </>
  );
}
