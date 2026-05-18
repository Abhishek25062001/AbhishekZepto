import { useQuery } from '@tanstack/react-query';

import { getMySessions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useVendorSessions() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const vendorUserId = useAuthStore((state) => state.vendorUserId);

  return useQuery({
    queryKey: ['vendor-sessions', vendorUserId],
    queryFn: async () => {
      const response = await getMySessions();
      return response.data.sessions;
    },
    enabled: isAuthenticated && Boolean(vendorUserId),
  });
}
