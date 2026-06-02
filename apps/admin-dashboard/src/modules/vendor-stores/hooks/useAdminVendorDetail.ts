import { useQuery } from '@tanstack/react-query';

import { getAdminVendor } from '../api/admin-vendor-store.api';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

export const useAdminVendorDetail = (vendorId: string) => useQuery({
  enabled: Boolean(vendorId),
  queryKey: adminVendorStoreQueryKeys.vendorDetail(vendorId),
  queryFn: () => getAdminVendor(vendorId),
});
