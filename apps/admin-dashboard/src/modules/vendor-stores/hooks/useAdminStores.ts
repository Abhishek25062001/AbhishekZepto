import { useQuery } from '@tanstack/react-query';

import { listAdminStores } from '../api/admin-vendor-store.api';
import type { AdminStoreListQuery } from '../types/admin-vendor-store.types';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

export const useAdminStores = (query: AdminStoreListQuery = {}) => useQuery({
  queryKey: adminVendorStoreQueryKeys.stores(query),
  queryFn: () => listAdminStores(query),
});
