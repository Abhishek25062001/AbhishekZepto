import { useQuery } from '@tanstack/react-query';

import { getAdminUserSessions } from '../services/api/user-sessions.api';
import { useAuthStore } from '../store/auth.store';

export function useAdminUserSessions(userId: string | undefined) {
  const adminId = useAuthStore((state) => state.adminId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['admin-user-sessions', adminId, userId],
    queryFn: async () => {
      if (!userId) {
        return {
          userId: '',
          sessions: [],
        };
      }

      const response = await getAdminUserSessions(userId);
      return response.data;
    },
    enabled: isAuthenticated && Boolean(adminId) && Boolean(userId),
  });
}
