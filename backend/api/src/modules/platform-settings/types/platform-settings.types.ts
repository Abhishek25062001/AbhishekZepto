import type { HydratedDocument, Types } from 'mongoose';

import type {
  PLATFORM_SETTING_CATEGORY,
  PLATFORM_SETTING_SCOPE_TYPE,
  PLATFORM_SETTING_VALUE_TYPE,
} from '../constants/platform-settings.constants';

export type PlatformSettingCategory =
  (typeof PLATFORM_SETTING_CATEGORY)[keyof typeof PLATFORM_SETTING_CATEGORY];

export type PlatformSettingScopeType =
  (typeof PLATFORM_SETTING_SCOPE_TYPE)[keyof typeof PLATFORM_SETTING_SCOPE_TYPE];

export type PlatformSettingValueType =
  (typeof PLATFORM_SETTING_VALUE_TYPE)[keyof typeof PLATFORM_SETTING_VALUE_TYPE];

export type PlatformSettingValue = boolean | number | string | Record<string, unknown> | unknown[];

export type PlatformSettingRecord = {
  _id: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
};

export type PlatformSettingDocument = HydratedDocument<PlatformSettingRecord>;

export type ListPlatformSettingsQuery = {
  category?: PlatformSettingCategory;
  scopeType?: PlatformSettingScopeType;
  scopeId?: string;
  search?: string;
  page: number;
  limit: number;
};

export type UpdatePlatformSettingInput = {
  settingKey: string;
  value: PlatformSettingValue;
  reason: string;
  adminId: string;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};
