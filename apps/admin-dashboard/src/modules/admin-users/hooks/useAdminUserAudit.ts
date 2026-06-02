import { useQuery } from '@tanstack/react-query';

import { listAdminUserAudit } from '../api/admin-users.api';
import { adminUsersQueryKeys } from './useAdminUsers';

export const useAdminUserAudit = (adminUserId: string) => useQuery({
  enabled: Boolean(adminUserId),
  queryKey: adminUsersQueryKeys.audit(adminUserId),
  queryFn: () => listAdminUserAudit(adminUserId),
});

