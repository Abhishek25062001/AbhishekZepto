import { useQuery } from '@tanstack/react-query';

import { getMySessions } from '../services/api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAdminSessions() {
  const adminId = useAuthStore((state) => state.adminId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['admin-sessions', adminId],
    queryFn: async () => {
      const response = await getMySessions();
      return response.data.sessions;
    },
    enabled: isAuthenticated && Boolean(adminId),
  });
}
