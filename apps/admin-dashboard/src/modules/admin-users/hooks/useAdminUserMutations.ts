import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminUser,
  updateAdminUser,
  updateAdminUserPermissions,
  updateAdminUserRole,
  updateAdminUserStatus,
} from '../api/admin-users.api';
import type {
  AdminUserPermissionsPayload,
  AdminUserRolePayload,
  AdminUserStatusPayload,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from '../types/admin-users.types';
import { adminUsersQueryKeys } from './useAdminUsers';

const invalidateAdminUsers = async (
  queryClient: ReturnType<typeof useQueryClient>,
  adminUserId?: string,
) => {
  await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all });
  if (adminUserId) {
    await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.detail(adminUserId) });
    await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.audit(adminUserId) });
  }
};

export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => createAdminUser(payload),
    onSuccess: async () => invalidateAdminUsers(queryClient),
  });
};

export const useUpdateAdminUserMutation = (adminUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdminUserPayload) => updateAdminUser(adminUserId, payload),
    onSuccess: async () => invalidateAdminUsers(queryClient, adminUserId),
  });
};

export const useUpdateAdminUserStatusMutation = (adminUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminUserStatusPayload) => updateAdminUserStatus(adminUserId, payload),
    onSuccess: async () => invalidateAdminUsers(queryClient, adminUserId),
  });
};

export const useUpdateAdminUserRoleMutation = (adminUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminUserRolePayload) => updateAdminUserRole(adminUserId, payload),
    onSuccess: async () => invalidateAdminUsers(queryClient, adminUserId),
  });
};

export const useUpdateAdminUserPermissionsMutation = (adminUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminUserPermissionsPayload) =>
      updateAdminUserPermissions(adminUserId, payload),
    onSuccess: async () => invalidateAdminUsers(queryClient, adminUserId),
  });
};

