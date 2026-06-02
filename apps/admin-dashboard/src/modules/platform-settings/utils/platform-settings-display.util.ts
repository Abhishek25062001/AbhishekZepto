import type { PlatformSettingValue } from '../types/platform-settings.types';

export const formatPlatformSettingLabel = (value: string): string => value
  .split('_')
  .join(' ')
  .replace(/\b\w/g, character => character.toUpperCase());

export const formatPlatformSettingDate = (value?: string | null): string => {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const stringifyPlatformSettingValue = (value: PlatformSettingValue): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
};
