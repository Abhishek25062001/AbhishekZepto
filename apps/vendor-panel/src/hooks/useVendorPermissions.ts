import { useQuery } from '@tanstack/react-query';

import { getVendorPermissions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useVendorPermissions() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const vendorUserId = useAuthStore((state) => state.vendorUserId);

  return useQuery({
    queryKey: ['vendor-permissions', vendorUserId],
    queryFn: async () => {
      const response = await getVendorPermissions();

      useAuthStore.setState((state) => ({
        ...state,
        role: response.data.role,
        permissions: response.data.permissions,
        vendorId: response.data.vendorId,
        storeId: response.data.storeId,
        cityId: response.data.cityId,
      }));

      return {
        vendorUserId: response.data.vendorUserId,
        vendorId: response.data.vendorId,
        storeId: response.data.storeId,
        cityId: response.data.cityId,
        role: response.data.role,
        permissions: response.data.permissions,
      };
    },
    enabled: isAuthenticated && Boolean(vendorUserId),
  });
}
