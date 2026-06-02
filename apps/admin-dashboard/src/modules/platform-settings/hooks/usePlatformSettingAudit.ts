import { useQuery } from '@tanstack/react-query';

import { listPlatformSettingAudit } from '../api/platform-settings.api';
import { platformSettingsQueryKeys } from './usePlatformSettings';

export const usePlatformSettingAudit = (settingKey: string) => useQuery({
  enabled: Boolean(settingKey),
  queryKey: platformSettingsQueryKeys.audit(settingKey),
  queryFn: () => listPlatformSettingAudit(settingKey),
});
