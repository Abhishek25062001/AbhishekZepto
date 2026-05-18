import type {
  ApiSuccessResponse,
  ListAdminUserSessionsResponse,
  RevokeAdminUserSessionResponse,
  RevokeAllAdminUserSessionsResponse,
} from '../../../../../packages/shared/api';
import { apiClient } from './client';

export const getAdminUserSessions = async (
  userId: string,
): Promise<ApiSuccessResponse<ListAdminUserSessionsResponse>> => {
  const response = await apiClient.get<ApiSuccessResponse<ListAdminUserSessionsResponse>>(
    `/api/v1/admin/users/${userId}/sessions`,
  );

  return response.data;
};

export const revokeAdminUserSession = async (
  userId: string,
  sessionId: string,
): Promise<ApiSuccessResponse<RevokeAdminUserSessionResponse>> => {
  const response = await apiClient.delete<ApiSuccessResponse<RevokeAdminUserSessionResponse>>(
    `/api/v1/admin/users/${userId}/sessions/${sessionId}`,
  );

  return response.data;
};

export const revokeAllAdminUserSessions = async (
  userId: string,
): Promise<ApiSuccessResponse<RevokeAllAdminUserSessionsResponse>> => {
  const response = await apiClient.delete<ApiSuccessResponse<RevokeAllAdminUserSessionsResponse>>(
    `/api/v1/admin/users/${userId}/sessions`,
  );

  return response.data;
};
