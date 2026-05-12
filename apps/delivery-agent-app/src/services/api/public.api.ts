import { apiClient } from './client';
import type {
  ApiSuccessResponse,
  HealthStatusResponse,
  SystemInfoResponse,
  VersionInfoResponse,
} from '../../../../../packages/shared/api';

export const checkBackendHealth = async (): Promise<
  ApiSuccessResponse<HealthStatusResponse>
> => {
  const response =
    await apiClient.get<ApiSuccessResponse<HealthStatusResponse>>(
      '/api/v1/public/health',
    );

  return response.data;
};

export const getBackendVersion = async (): Promise<
  ApiSuccessResponse<VersionInfoResponse>
> => {
  const response =
    await apiClient.get<ApiSuccessResponse<VersionInfoResponse>>(
      '/api/v1/public/version',
    );

  return response.data;
};

export const getSystemInfo = async (): Promise<
  ApiSuccessResponse<SystemInfoResponse>
> => {
  const response =
    await apiClient.get<ApiSuccessResponse<SystemInfoResponse>>(
      '/api/v1/public/system-info',
    );

  return response.data;
};
