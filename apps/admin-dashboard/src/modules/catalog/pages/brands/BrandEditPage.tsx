import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { BrandForm } from '../../forms/BrandForm';
import { useBrandDetail } from '../../hooks/useBrandDetail';
import { useBrandMutations } from '../../hooks/useBrandMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function BrandEditPage() {
  const navigate = useNavigate();
  const { brandId } = useParams<{ brandId: string }>();
  const detail = useBrandDetail(brandId);
  const { updateMutation } = useBrandMutations();

  if (detail.isLoading || !brandId) {
    return <Loader label="Loading brand…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this brand.',
        )}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader description="Update brand assets and visibility." title="Edit brand" />
      <BrandForm
        defaultValues={{
          bannerUrl: record.bannerUrl ?? '',
          description: record.description ?? '',
          isFeatured: record.isFeatured,
          isVisible: record.isVisible,
          logoUrl: record.logoUrl ?? '',
          name: record.name,
          status: record.status,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ brandId, payload: values });
            navigate('/catalog/brands');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to update brand. Please try again.',
              ),
            );
          }
        }}
      />
    </>
  );
}
