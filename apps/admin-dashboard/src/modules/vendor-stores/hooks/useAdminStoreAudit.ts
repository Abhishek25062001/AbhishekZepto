import { useQuery } from '@tanstack/react-query';

import { listAdminStoreAudit } from '../api/admin-vendor-store.api';
import type { AdminStoreInspectionQuery } from '../types/admin-vendor-store.types';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

export const useAdminStoreAudit = (
  storeId: string,
  query: AdminStoreInspectionQuery = {},
) => useQuery({
  enabled: Boolean(storeId),
  queryKey: adminVendorStoreQueryKeys.storeAudit(storeId, query),
  queryFn: () => listAdminStoreAudit(storeId, query),
});
