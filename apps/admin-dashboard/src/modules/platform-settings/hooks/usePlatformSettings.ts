import { useQuery } from '@tanstack/react-query';

import { listPlatformSettings } from '../api/platform-settings.api';
import type { PlatformSettingsListQuery } from '../types/platform-settings.types';

export const platformSettingsQueryKeys = {
  all: ['platform-settings'] as const,
  list: (query: PlatformSettingsListQuery) => [...platformSettingsQueryKeys.all, 'list', query] as const,
  detail: (settingKey: string) => [...platformSettingsQueryKeys.all, 'detail', settingKey] as const,
  audit: (settingKey: string) => [...platformSettingsQueryKeys.all, 'audit', settingKey] as const,
};

export const usePlatformSettings = (query: PlatformSettingsListQuery = {}) => useQuery({
  queryKey: platformSettingsQueryKeys.list(query),
  queryFn: () => listPlatformSettings(query),
});
