import type { PlatformSettingValue } from '../types/platform-settings.types';
import { stringifyPlatformSettingValue } from '../utils/platform-settings-display.util';

export function PlatformSettingValuePreview({ value }: { value: PlatformSettingValue }) {
  const display = stringifyPlatformSettingValue(value);

  return (
    <code
      style={{
        background: 'var(--color-background)',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-block',
        maxWidth: 260,
        overflow: 'hidden',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={display}
    >
      {display}
    </code>
  );
}
