import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

export const PLATFORM_SETTING_CATEGORY = {
  PLATFORM: 'platform',
  CITY: 'city',
  STORE: 'store',
  FEATURE: 'feature',
  OPERATIONAL: 'operational',
} as const;

export const PLATFORM_SETTING_CATEGORIES = Object.values(PLATFORM_SETTING_CATEGORY);

export const PLATFORM_SETTING_SCOPE_TYPE = {
  GLOBAL: 'global',
  CITY: 'city',
  STORE: 'store',
} as const;

export const PLATFORM_SETTING_SCOPE_TYPES = Object.values(PLATFORM_SETTING_SCOPE_TYPE);

export const PLATFORM_SETTING_VALUE_TYPE = {
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  STRING: 'string',
  JSON: 'json',
} as const;

export const PLATFORM_SETTING_VALUE_TYPES = Object.values(PLATFORM_SETTING_VALUE_TYPE);

export const PLATFORM_SETTINGS_PERMISSIONS = {
  READ: createPermissionCode(
    AUTH_PERMISSION_RESOURCE.SETTINGS,
    AUTH_PERMISSION_ACTION.READ,
  ),
  MANAGE: createPermissionCode(
    AUTH_PERMISSION_RESOURCE.SETTINGS,
    AUTH_PERMISSION_ACTION.MANAGE,
  ),
} as const;

export const PLATFORM_SETTINGS_DEFAULT_PAGE = 1;
export const PLATFORM_SETTINGS_DEFAULT_LIMIT = 20;
export const PLATFORM_SETTINGS_MAX_LIMIT = 100;
