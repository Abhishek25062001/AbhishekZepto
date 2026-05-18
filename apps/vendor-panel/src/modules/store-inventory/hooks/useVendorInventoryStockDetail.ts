import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getVendorInventoryStockById } from '../api/vendor-inventory.api';

export function useVendorInventoryStockDetail(inventoryStockId?: string) {
  const params = useParams<{ inventoryStockId: string }>();
  const id = inventoryStockId ?? params.inventoryStockId;

  return useQuery({
    queryKey: ['vendor-inventory-stock', id],
    queryFn: () => getVendorInventoryStockById(id!),
    enabled: Boolean(id),
  });
}
