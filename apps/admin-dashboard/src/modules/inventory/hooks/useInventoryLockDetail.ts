import { useQuery } from '@tanstack/react-query';

import { getAdminInventoryLockById } from '../api/inventory-lock.api';

export function useInventoryLockDetail(lockId: string | undefined) {
  return useQuery({
    queryKey: ['admin-inventory-lock', lockId],
    queryFn: () => getAdminInventoryLockById(lockId as string),
    enabled: Boolean(lockId),
  });
}
