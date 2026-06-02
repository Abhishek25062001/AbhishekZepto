import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  PlatformSetting,
  PlatformSettingAuditRecord,
  PlatformSettingsListQuery,
  PlatformSettingsListResponse,
  PlatformSettingsListResult,
  UpdatePlatformSettingPayload,
} from '../types/platform-settings.types';

const BASE = '/api/v1/admin/settings';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const toPagination = (data: PlatformSettingsListResponse): PlatformSettingsListResult => {
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

export const listPlatformSettings = async (
  query: PlatformSettingsListQuery = {},
): Promise<PlatformSettingsListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<PlatformSettingsListResponse>>(BASE, {
    params: query,
  });
  return toPagination(response.data.data);
};

export const getPlatformSetting = async (settingKey: string): Promise<PlatformSetting> => {
  const response = await apiClient.get<ApiSuccessResponse<PlatformSetting>>(`${BASE}/${settingKey}`);
  return unwrapData(response.data);
};

export const updatePlatformSetting = async (
  settingKey: string,
  payload: UpdatePlatformSettingPayload,
): Promise<PlatformSetting> => {
  const response = await apiClient.patch<ApiSuccessResponse<PlatformSetting>>(
    `${BASE}/${settingKey}`,
    payload,
  );
  return unwrapData(response.data);
};

export const listPlatformSettingAudit = async (
  settingKey: string,
): Promise<PlatformSettingAuditRecord[]> => {
  const response = await apiClient.get<ApiSuccessResponse<PlatformSettingAuditRecord[]>>(
    `${BASE}/${settingKey}/audit`,
  );
  return unwrapData(response.data);
};
