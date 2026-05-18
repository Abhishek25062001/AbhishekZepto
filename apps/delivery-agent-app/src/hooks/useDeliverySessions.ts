import { useQuery } from '@tanstack/react-query';

import { getMySessions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useDeliverySessions() {
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['delivery-sessions', deliveryAgentId],
    queryFn: async () => {
      const response = await getMySessions();
      return response.data.sessions;
    },
    enabled: isAuthenticated && Boolean(deliveryAgentId),
  });
}
