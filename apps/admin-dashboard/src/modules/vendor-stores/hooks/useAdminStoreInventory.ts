import { useQuery } from '@tanstack/react-query';

import { listAdminStoreInventory } from '../api/admin-vendor-store.api';
import type { AdminStoreInspectionQuery } from '../types/admin-vendor-store.types';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

export const useAdminStoreInventory = (
  storeId: string,
  query: AdminStoreInspectionQuery = {},
) => useQuery({
  enabled: Boolean(storeId),
  queryKey: adminVendorStoreQueryKeys.storeInventory(storeId, query),
  queryFn: () => listAdminStoreInventory(storeId, query),
});
