import { useNavigate } from 'react-router-dom';

import { Loader } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { InventoryStockForm } from '../../forms/InventoryStockForm';
import { useInventoryStockMutations } from '../../hooks/useInventoryStockMutations';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';

export function InventoryStockCreatePage() {
  const navigate = useNavigate();
  const { createMutation } = useInventoryStockMutations();

  return (
    <>
      <CatalogPageHeader
        description="Create an inventory stock record for a mapped store product."
        requiredPermission="inventory:create"
        title="Create stock"
      />
      <InventoryStockForm
        submitLabel={createMutation.isPending ? 'Saving…' : 'Create stock'}
        onSubmit={async (values) => {
          try {
            await createMutation.mutateAsync(values);
            navigate('/inventory/stocks');
          } catch (error) {
            alert(mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to create stock.'));
          }
        }}
      />
      {createMutation.isPending ? <Loader label="Creating stock…" /> : null}
    </>
  );
}
