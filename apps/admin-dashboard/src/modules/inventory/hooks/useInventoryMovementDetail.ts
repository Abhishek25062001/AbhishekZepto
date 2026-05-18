import { useQuery } from '@tanstack/react-query';

import { getAdminInventoryMovementById } from '../api/inventory-movement.api';

export function useInventoryMovementDetail(movementId: string | undefined) {
  return useQuery({
    queryKey: ['admin-inventory-movement', movementId],
    queryFn: () => getAdminInventoryMovementById(movementId as string),
    enabled: Boolean(movementId),
  });
}
