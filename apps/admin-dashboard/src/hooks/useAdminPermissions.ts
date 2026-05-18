import { useQuery } from '@tanstack/react-query';

import { getAdminPermissions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAdminPermissions() {
  const adminId = useAuthStore((state) => state.adminId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['admin-permissions', adminId],
    queryFn: async () => {
      const response = await getAdminPermissions();

      useAuthStore.setState((state) => ({
        ...state,
        role: response.data.role,
        permissions: response.data.permissions,
      }));

      return {
        adminId: response.data.adminId,
        role: response.data.role,
        permissions: response.data.permissions,
      };
    },
    enabled: isAuthenticated && Boolean(adminId),
  });
}
