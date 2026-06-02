import { Link } from 'react-router-dom';

import { Badge, Table, type TableColumn } from '../../../components/common';
import type { PlatformSetting } from '../types/platform-settings.types';
import {
  formatPlatformSettingDate,
  formatPlatformSettingLabel,
} from '../utils/platform-settings-display.util';
import { PlatformSettingValuePreview } from './PlatformSettingValuePreview';

type PlatformSettingTableRow = PlatformSetting & Record<string, unknown>;

const columns: TableColumn<PlatformSettingTableRow>[] = [
  {
    header: 'Setting',
    key: 'key',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.key}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.description}</span>
      </div>
    ),
  },
  {
    header: 'Category',
    key: 'category',
    render: row => formatPlatformSettingLabel(row.category),
  },
  {
    header: 'Scope',
    key: 'scopeType',
    render: row => `${formatPlatformSettingLabel(row.scopeType)}${row.scopeId ? ` · ${row.scopeId}` : ''}`,
  },
  {
    header: 'Value',
    key: 'value',
    render: row => <PlatformSettingValuePreview value={row.value} />,
  },
  {
    header: 'Flags',
    key: 'isEditable',
    render: row => (
      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
        <Badge variant={row.isEditable ? 'success' : 'neutral'}>
          {row.isEditable ? 'Editable' : 'Locked'}
        </Badge>
        {row.isSensitive ? <Badge variant="warning">Sensitive</Badge> : null}
      </div>
    ),
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatPlatformSettingDate(row.updatedAt),
  },
  {
    header: 'Actions',
    key: 'id',
    render: row => <Link to={`/settings/platform/${encodeURIComponent(row.key)}`}>View</Link>,
  },
];

export function PlatformSettingsTable({
  loading,
  settings,
}: {
  loading?: boolean;
  settings: PlatformSetting[];
}) {
  return (
    <Table
      columns={columns}
      data={settings as PlatformSettingTableRow[]}
      emptyMessage="No platform settings found."
      loading={loading}
      rowKey="key"
    />
  );
}
