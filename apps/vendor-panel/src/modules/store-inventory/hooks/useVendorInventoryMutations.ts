import { useMutation, useQueryClient } from '@tanstack/react-query';

import { adjustVendorInventoryStock } from '../api/vendor-inventory.api';
import type { VendorInventoryAdjustmentPayload } from '../types/vendor-inventory.types';

export function useVendorInventoryMutations() {
  const queryClient = useQueryClient();

  const adjustStock = useMutation({
    mutationFn: ({
      inventoryStockId,
      payload,
    }: {
      inventoryStockId: string;
      payload: VendorInventoryAdjustmentPayload;
    }) => adjustVendorInventoryStock(inventoryStockId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['vendor-inventory-stocks'] });
      void queryClient.invalidateQueries({
        queryKey: ['vendor-inventory-stock', variables.inventoryStockId],
      });
      void queryClient.invalidateQueries({ queryKey: ['vendor-inventory-movements'] });
    },
  });

  return { adjustStock };
}
