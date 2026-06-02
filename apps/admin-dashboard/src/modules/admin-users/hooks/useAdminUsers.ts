import { useQuery } from '@tanstack/react-query';

import { listAdminUsers } from '../api/admin-users.api';
import type { AdminUserListQuery } from '../types/admin-users.types';

export const adminUsersQueryKeys = {
  all: ['admin-users'] as const,
  list: (query: AdminUserListQuery) => [...adminUsersQueryKeys.all, 'list', query] as const,
  detail: (adminUserId: string) => [...adminUsersQueryKeys.all, 'detail', adminUserId] as const,
  audit: (adminUserId: string) => [...adminUsersQueryKeys.all, 'audit', adminUserId] as const,
};

export const useAdminUsers = (query: AdminUserListQuery = {}) => useQuery({
  queryKey: adminUsersQueryKeys.list(query),
  queryFn: () => listAdminUsers(query),
});

