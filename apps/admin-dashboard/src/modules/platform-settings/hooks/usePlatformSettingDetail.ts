import { useQuery } from '@tanstack/react-query';

import { getPlatformSetting } from '../api/platform-settings.api';
import { platformSettingsQueryKeys } from './usePlatformSettings';

export const usePlatformSettingDetail = (settingKey: string) => useQuery({
  enabled: Boolean(settingKey),
  queryKey: platformSettingsQueryKeys.detail(settingKey),
  queryFn: () => getPlatformSetting(settingKey),
});
