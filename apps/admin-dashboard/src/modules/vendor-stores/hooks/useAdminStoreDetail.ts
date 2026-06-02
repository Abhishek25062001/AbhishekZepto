import { useQuery } from '@tanstack/react-query';

import { getAdminStore } from '../api/admin-vendor-store.api';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

export const useAdminStoreDetail = (storeId: string) => useQuery({
  enabled: Boolean(storeId),
  queryKey: adminVendorStoreQueryKeys.storeDetail(storeId),
  queryFn: () => getAdminStore(storeId),
});
