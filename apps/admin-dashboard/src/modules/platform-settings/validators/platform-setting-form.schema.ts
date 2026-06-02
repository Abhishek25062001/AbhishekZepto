import { z } from 'zod';

import type {
  PlatformSettingValue,
  PlatformSettingValueType,
} from '../types/platform-settings.types';

const jsonObjectSchema: z.ZodType<Record<string, unknown>> = z.record(z.string(), z.unknown());
const jsonArraySchema: z.ZodType<unknown[]> = z.array(z.unknown());

export const platformSettingUpdateFormSchema = z.object({
  reason: z.string().trim().min(1).max(500),
  value: z.union([
    z.boolean(),
    z.number(),
    z.string().trim().min(1),
    jsonObjectSchema,
    jsonArraySchema,
  ]),
});

export type PlatformSettingUpdateFormValues = z.infer<typeof platformSettingUpdateFormSchema>;

export const parsePlatformSettingValue = (
  rawValue: string,
  valueType: PlatformSettingValueType,
): PlatformSettingValue => {
  const trimmedValue = rawValue.trim();

  if (valueType === 'boolean') {
    if (trimmedValue === 'true') return true;
    if (trimmedValue === 'false') return false;
    throw new Error('Select true or false.');
  }

  if (valueType === 'number') {
    const numericValue = Number(trimmedValue);
    if (!Number.isFinite(numericValue)) {
      throw new Error('Enter a valid number.');
    }
    return numericValue;
  }

  if (valueType === 'json') {
    try {
      return JSON.parse(trimmedValue) as PlatformSettingValue;
    } catch {
      throw new Error('Enter valid JSON.');
    }
  }

  return trimmedValue;
};
