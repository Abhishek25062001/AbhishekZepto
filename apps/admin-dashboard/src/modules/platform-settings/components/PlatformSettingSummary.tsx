import { Badge, Card } from '../../../components/common';
import type { PlatformSetting } from '../types/platform-settings.types';
import {
  formatPlatformSettingDate,
  formatPlatformSettingLabel,
} from '../utils/platform-settings-display.util';
import { PlatformSettingValuePreview } from './PlatformSettingValuePreview';

export function PlatformSettingSummary({ setting }: { setting: PlatformSetting }) {
  return (
    <Card title={setting.key}>
      <dl
        style={{
          display: 'grid',
          gap: 'var(--spacing-md)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Description</dt>
          <dd style={{ margin: 0 }}>{setting.description}</dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Category</dt>
          <dd style={{ margin: 0 }}>{formatPlatformSettingLabel(setting.category)}</dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Scope</dt>
          <dd style={{ margin: 0 }}>
            {formatPlatformSettingLabel(setting.scopeType)}
            {setting.scopeId ? ` · ${setting.scopeId}` : ''}
          </dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Value Type</dt>
          <dd style={{ margin: 0 }}>{formatPlatformSettingLabel(setting.valueType)}</dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Current Value</dt>
          <dd style={{ margin: 0 }}>
            <PlatformSettingValuePreview value={setting.value} />
          </dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Flags</dt>
          <dd style={{ display: 'flex', gap: 'var(--spacing-xs)', margin: 0 }}>
            <Badge variant={setting.isEditable ? 'success' : 'neutral'}>
              {setting.isEditable ? 'Editable' : 'Locked'}
            </Badge>
            {setting.isSensitive ? <Badge variant="warning">Sensitive</Badge> : null}
          </dd>
        </div>
        <div>
          <dt style={{ color: 'var(--color-text-secondary)' }}>Updated</dt>
          <dd style={{ margin: 0 }}>{formatPlatformSettingDate(setting.updatedAt)}</dd>
        </div>
      </dl>
    </Card>
  );
}
