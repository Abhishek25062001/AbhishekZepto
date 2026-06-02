import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlatformSetting } from '../api/platform-settings.api';
import type { UpdatePlatformSettingPayload } from '../types/platform-settings.types';
import { platformSettingsQueryKeys } from './usePlatformSettings';

const invalidatePlatformSettings = async (
  queryClient: ReturnType<typeof useQueryClient>,
  settingKey?: string,
) => {
  await queryClient.invalidateQueries({ queryKey: platformSettingsQueryKeys.all });
  if (settingKey) {
    await queryClient.invalidateQueries({ queryKey: platformSettingsQueryKeys.detail(settingKey) });
    await queryClient.invalidateQueries({ queryKey: platformSettingsQueryKeys.audit(settingKey) });
  }
};

export const useUpdatePlatformSettingMutation = (settingKey: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePlatformSettingPayload) =>
      updatePlatformSetting(settingKey, payload),
    onSuccess: async () => invalidatePlatformSettings(queryClient, settingKey),
  });
};
