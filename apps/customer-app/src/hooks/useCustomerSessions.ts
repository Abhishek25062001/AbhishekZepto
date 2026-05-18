import { useQuery } from '@tanstack/react-query';

import { getMySessions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useCustomerSessions() {
  const customerId = useAuthStore((state) => state.customerId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['customer-sessions', customerId],
    queryFn: async () => {
      const response = await getMySessions();
      return response.data.sessions;
    },
    enabled: isAuthenticated && Boolean(customerId),
  });
}
