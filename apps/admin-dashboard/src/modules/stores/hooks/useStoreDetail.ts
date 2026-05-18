import { useQuery } from '@tanstack/react-query';

import { getAdminStoreById } from '../api/store.api';

export function useStoreDetail(storeId: string | undefined) {
  return useQuery({
    queryKey: ['admin-store', storeId],
    queryFn: () => getAdminStoreById(storeId as string),
    enabled: Boolean(storeId),
  });
}
