import { useQuery } from '@tanstack/react-query';

import { getAdminInventoryStockById } from '../api/inventory-stock.api';

export function useInventoryStockDetail(inventoryStockId: string | undefined) {
  return useQuery({
    queryKey: ['admin-inventory-stock', inventoryStockId],
    queryFn: () => getAdminInventoryStockById(inventoryStockId as string),
    enabled: Boolean(inventoryStockId),
  });
}
