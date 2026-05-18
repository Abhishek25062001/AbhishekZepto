import { useQuery } from '@tanstack/react-query';

import { getDeliveryPermissions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useDeliveryPermissions() {
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['delivery-permissions', deliveryAgentId],
    queryFn: async () => {
      const response = await getDeliveryPermissions();

      useAuthStore.setState((state) => ({
        ...state,
        role: response.data.role,
        permissions: response.data.permissions,
        cityId: response.data.cityId,
      }));

      return {
        deliveryAgentId: response.data.deliveryAgentId,
        role: response.data.role,
        cityId: response.data.cityId,
        permissions: response.data.permissions,
      };
    },
    enabled: isAuthenticated && Boolean(deliveryAgentId),
  });
}
