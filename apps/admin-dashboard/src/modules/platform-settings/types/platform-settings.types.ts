import type { ApiPaginationMeta } from '../../../types/api.types';

export type PlatformSettingCategory = 'platform' | 'city' | 'store' | 'feature' | 'operational';
export type PlatformSettingScopeType = 'global' | 'city' | 'store';
export type PlatformSettingValueType = 'boolean' | 'number' | 'string' | 'json';
export type PlatformSettingValue = boolean | number | string | Record<string, unknown> | unknown[];

export type PlatformSetting = {
  id: string;
  key: string;
  category: PlatformSettingCategory;
  value: PlatformSettingValue;
  valueType: PlatformSettingValueType;
  scopeType: PlatformSettingScopeType;
  scopeId: string | null;
  description: string;
  isSensitive: boolean;
  isEditable: boolean;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlatformSettingsListQuery = {
  category?: PlatformSettingCategory;
  scopeType?: PlatformSettingScopeType;
  scopeId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type PlatformSettingsListResponse = {
  items: PlatformSetting[];
  page: number;
  limit: number;
  total: number;
};

export type PlatformSettingsListResult = {
  items: PlatformSetting[];
  pagination: ApiPaginationMeta;
};

export type UpdatePlatformSettingPayload = {
  value: PlatformSettingValue;
  reason: string;
};

export type PlatformSettingAuditRecord = {
  _id: string;
  adminId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
  updatedAt: string;
};
