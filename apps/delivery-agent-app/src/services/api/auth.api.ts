import type {
  ApiSuccessResponse,
  AuthUserResponse,
  ListMySessionsResponse,
  LogoutBody,
  LogoutOtherSessionsBody,
  LogoutSessionBody,
  RefreshTokenBody,
  RefreshTokenResponse,
  RequestOtpBody,
  RequestOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
} from '../../../../../packages/shared/api';
import { apiClient } from './client';

export type DeliveryPermissionsResponse = AuthUserResponse & {
  customerId: string | null;
  deliveryAgentId: string;
};

export const requestOtp = async (
  body: RequestOtpBody,
): Promise<ApiSuccessResponse<RequestOtpResponse>> => {
  const response = await apiClient.post<ApiSuccessResponse<RequestOtpResponse>>(
    '/api/v1/public/auth/request-otp',
    body,
  );

  return response.data;
};

export const verifyOtp = async (
  body: VerifyOtpBody,
): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
  const response = await apiClient.post<ApiSuccessResponse<VerifyOtpResponse>>(
    '/api/v1/public/auth/verify-otp',
    body,
  );

  return response.data;
};

export const refreshToken = async (
  body: RefreshTokenBody,
): Promise<ApiSuccessResponse<RefreshTokenResponse>> => {
  const response = await apiClient.post<ApiSuccessResponse<RefreshTokenResponse>>(
    '/api/v1/public/auth/refresh-token',
    body,
  );

  return response.data;
};

export const logout = async (
  body: LogoutBody,
): Promise<ApiSuccessResponse<Record<string, never>>> => {
  const response = await apiClient.post<ApiSuccessResponse<Record<string, never>>>(
    '/api/v1/public/auth/logout',
    body,
  );

  return response.data;
};

export const getMySessions = async (): Promise<
  ApiSuccessResponse<ListMySessionsResponse>
> => {
  const response = await apiClient.get<ApiSuccessResponse<ListMySessionsResponse>>(
    '/api/v1/auth/me/sessions',
  );

  return response.data;
};

export const logoutSession = async (
  body: LogoutSessionBody,
): Promise<ApiSuccessResponse<Record<string, never>>> => {
  const response = await apiClient.post<ApiSuccessResponse<Record<string, never>>>(
    '/api/v1/auth/logout-session',
    body,
  );

  return response.data;
};

export const logoutOtherSessions = async (
  body: LogoutOtherSessionsBody = {},
): Promise<ApiSuccessResponse<Record<string, never>>> => {
  const response = await apiClient.post<ApiSuccessResponse<Record<string, never>>>(
    '/api/v1/auth/logout-other-sessions',
    body,
  );

  return response.data;
};

export const getDeliveryPermissions = async (): Promise<
  ApiSuccessResponse<DeliveryPermissionsResponse>
> => {
  const response = await apiClient.get<ApiSuccessResponse<DeliveryPermissionsResponse>>(
    '/api/v1/delivery/me/permissions',
  );

  return response.data;
};
