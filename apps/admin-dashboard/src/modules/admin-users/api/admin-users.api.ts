import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  AdminUserAuditRecord,
  AdminUserListQuery,
  AdminUserListResponse,
  AdminUserListResult,
  AdminUserPermissionsPayload,
  AdminUserRolePayload,
  AdminUserStatusPayload,
  AdminUserSummary,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from '../types/admin-users.types';

const BASE = '/api/v1/admin/users';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const toPagination = (data: AdminUserListResponse): AdminUserListResult => {
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return {
    items: data.items,
    pagination: {
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages,
      hasNextPage: data.page < totalPages,
      hasPreviousPage: data.page > 1,
    },
  };
};

export const listAdminUsers = async (
  query: AdminUserListQuery = {},
): Promise<AdminUserListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminUserListResponse>>(BASE, {
    params: query,
  });
  return toPagination(response.data.data);
};

export const createAdminUser = async (
  payload: CreateAdminUserPayload,
): Promise<AdminUserSummary> => {
  const response = await apiClient.post<ApiSuccessResponse<AdminUserSummary>>(BASE, payload);
  return unwrapData(response.data);
};

export const getAdminUser = async (adminUserId: string): Promise<AdminUserSummary> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminUserSummary>>(
    `${BASE}/${adminUserId}`,
  );
  return unwrapData(response.data);
};

export const updateAdminUser = async (
  adminUserId: string,
  payload: UpdateAdminUserPayload,
): Promise<AdminUserSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUserSummary>>(
    `${BASE}/${adminUserId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateAdminUserStatus = async (
  adminUserId: string,
  payload: AdminUserStatusPayload,
): Promise<AdminUserSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUserSummary>>(
    `${BASE}/${adminUserId}/status`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateAdminUserRole = async (
  adminUserId: string,
  payload: AdminUserRolePayload,
): Promise<AdminUserSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUserSummary>>(
    `${BASE}/${adminUserId}/roles`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateAdminUserPermissions = async (
  adminUserId: string,
  payload: AdminUserPermissionsPayload,
): Promise<AdminUserSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminUserSummary>>(
    `${BASE}/${adminUserId}/permissions`,
    payload,
  );
  return unwrapData(response.data);
};

export const listAdminUserAudit = async (
  adminUserId: string,
): Promise<AdminUserAuditRecord[]> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminUserAuditRecord[]>>(
    `${BASE}/${adminUserId}/audit`,
  );
  return unwrapData(response.data);
};

