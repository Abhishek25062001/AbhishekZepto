import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogPageHeader } from '../../components/CatalogPageHeader';
import { ProductUnitForm } from '../../forms/ProductUnitForm';
import { useProductUnitDetail } from '../../hooks/useProductUnitDetail';
import { useProductUnitMutations } from '../../hooks/useProductUnitMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function ProductUnitEditPage() {
  const navigate = useNavigate();
  const { unitId } = useParams<{ unitId: string }>();
  const detail = useProductUnitDetail(unitId);
  const { updateMutation } = useProductUnitMutations();

  if (detail.isLoading || !unitId) {
    return <Loader label="Loading unit…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this unit.',
        )}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader description="Adjust conversion metadata for this unit." title="Edit unit" />
      <ProductUnitForm
        defaultValues={{
          baseUnit: record.baseUnit,
          code: record.code,
          conversionFactor: record.conversionFactor,
          name: record.name,
          status: record.status,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ unitId, payload: values });
            navigate('/catalog/units');
          } catch (error) {
            alert(
              mapCatalogErrorCodeToMessage(
                extractApiErrorCode(error),
                'Unable to update unit. Please try again.',
              ),
            );
          }
        }}
      />
    </>
  );
}
