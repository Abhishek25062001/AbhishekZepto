import { useQuery } from '@tanstack/react-query';

import { getAdminUser } from '../api/admin-users.api';
import { adminUsersQueryKeys } from './useAdminUsers';

export const useAdminUserDetail = (adminUserId: string) => useQuery({
  enabled: Boolean(adminUserId),
  queryKey: adminUsersQueryKeys.detail(adminUserId),
  queryFn: () => getAdminUser(adminUserId),
});

