import type {
  PlatformSettingCategory,
  PlatformSettingScopeType,
} from '../types/platform-settings.types';

export const PLATFORM_SETTING_CATEGORY_OPTIONS: Array<{
  label: string;
  value: PlatformSettingCategory;
}> = [
  { label: 'Platform', value: 'platform' },
  { label: 'City', value: 'city' },
  { label: 'Store', value: 'store' },
  { label: 'Feature', value: 'feature' },
  { label: 'Operational', value: 'operational' },
];

export const PLATFORM_SETTING_SCOPE_OPTIONS: Array<{
  label: string;
  value: PlatformSettingScopeType;
}> = [
  { label: 'Global', value: 'global' },
  { label: 'City', value: 'city' },
  { label: 'Store', value: 'store' },
];

export const PLATFORM_SETTING_DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
} as const;
