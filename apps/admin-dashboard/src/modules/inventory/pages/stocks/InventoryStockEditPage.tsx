import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { InventoryStockForm } from '../../forms/InventoryStockForm';
import { useInventoryStockDetail } from '../../hooks/useInventoryStockDetail';
import { useInventoryStockMutations } from '../../hooks/useInventoryStockMutations';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function InventoryStockEditPage() {
  const navigate = useNavigate();
  const { inventoryStockId } = useParams<{ inventoryStockId: string }>();
  const detail = useInventoryStockDetail(inventoryStockId);
  const { updateMutation } = useInventoryStockMutations();

  if (detail.isLoading || !inventoryStockId) {
    return <Loader label="Loading stock…" mode="page" />;
  }

  if (detail.error || !detail.data) {
    return (
      <InventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load stock.')}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const record = detail.data;

  return (
    <>
      <CatalogPageHeader
        description="Update stock quantities and thresholds."
        requiredPermission="inventory:update"
        title="Edit stock"
      />
      <InventoryStockForm
        defaultValues={{
          availableQuantity: record.availableQuantity,
          damagedQuantity: record.damagedQuantity,
          expiredQuantity: record.expiredQuantity,
          lowStockThreshold: record.lowStockThreshold,
          reorderLevel: record.reorderLevel,
          reservedQuantity: record.reservedQuantity,
          status: record.status,
          storeProductId: record.storeProductId,
        }}
        submitLabel={updateMutation.isPending ? 'Saving…' : 'Save changes'}
        onSubmit={async (values) => {
          try {
            await updateMutation.mutateAsync({ inventoryStockId, payload: values });
            navigate('/inventory/stocks');
          } catch (error) {
            alert(mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to update stock.'));
          }
        }}
      />
    </>
  );
}
