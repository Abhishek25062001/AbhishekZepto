import { useQuery } from '@tanstack/react-query';

import { getCustomerPermissions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useCustomerPermissions() {
  const customerId = useAuthStore((state) => state.customerId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['customer-permissions', customerId],
    queryFn: async () => {
      const response = await getCustomerPermissions();

      useAuthStore.setState((state) => ({
        ...state,
        role: response.data.role,
        permissions: response.data.permissions,
        cityId: response.data.cityId,
      }));

      return {
        customerId: response.data.customerId,
        role: response.data.role,
        cityId: response.data.cityId,
        permissions: response.data.permissions,
      };
    },
    enabled: isAuthenticated && Boolean(customerId),
  });
}
