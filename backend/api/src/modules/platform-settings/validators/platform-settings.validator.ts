import { z } from 'zod';

import {
  PLATFORM_SETTING_CATEGORIES,
  PLATFORM_SETTING_SCOPE_TYPES,
  PLATFORM_SETTINGS_DEFAULT_LIMIT,
  PLATFORM_SETTINGS_DEFAULT_PAGE,
  PLATFORM_SETTINGS_MAX_LIMIT,
} from '../constants/platform-settings.constants';

export const platformSettingKeyParamValidator = {
  params: z.object({
    settingKey: z.string().trim().min(2).max(120),
  }),
};

export const listPlatformSettingsQueryValidator = {
  query: z.object({
    category: z.enum(PLATFORM_SETTING_CATEGORIES as [string, ...string[]]).optional(),
    scopeType: z.enum(PLATFORM_SETTING_SCOPE_TYPES as [string, ...string[]]).optional(),
    scopeId: z.string().trim().min(1).max(120).optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(PLATFORM_SETTINGS_DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PLATFORM_SETTINGS_MAX_LIMIT).default(
      PLATFORM_SETTINGS_DEFAULT_LIMIT,
    ),
  }),
};

export const updatePlatformSettingValidator = {
  body: z.object({
    value: z.union([
      z.boolean(),
      z.number(),
      z.string().trim().max(5000),
      z.record(z.string(), z.unknown()),
      z.array(z.unknown()),
    ]),
    reason: z.string().trim().min(5).max(500),
  }),
};
