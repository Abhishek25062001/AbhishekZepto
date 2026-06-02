import { useQuery } from '@tanstack/react-query';

import { listAdminStoreOrders } from '../api/admin-vendor-store.api';
import type { AdminStoreInspectionQuery } from '../types/admin-vendor-store.types';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

export const useAdminStoreOrders = (
  storeId: string,
  query: AdminStoreInspectionQuery = {},
) => useQuery({
  enabled: Boolean(storeId),
  queryKey: adminVendorStoreQueryKeys.storeOrders(storeId, query),
  queryFn: () => listAdminStoreOrders(storeId, query),
});
