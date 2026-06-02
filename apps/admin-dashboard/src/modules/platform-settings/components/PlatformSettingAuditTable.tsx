import { Card, Table, type TableColumn } from '../../../components/common';
import type { PlatformSettingAuditRecord } from '../types/platform-settings.types';
import { formatPlatformSettingDate } from '../utils/platform-settings-display.util';

type PlatformSettingAuditRow = PlatformSettingAuditRecord & Record<string, unknown>;

const columns: TableColumn<PlatformSettingAuditRow>[] = [
  {
    header: 'Action',
    key: 'actionType',
  },
  {
    header: 'Reason',
    key: 'reason',
  },
  {
    header: 'Admin',
    key: 'adminId',
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: row => formatPlatformSettingDate(row.createdAt),
  },
];

export function PlatformSettingAuditTable({
  audit,
  loading,
}: {
  audit: PlatformSettingAuditRecord[];
  loading?: boolean;
}) {
  return (
    <Card title="Audit">
      <Table
        columns={columns}
        data={audit as PlatformSettingAuditRow[]}
        emptyMessage="No audit entries found."
        loading={loading}
        rowKey="_id"
      />
    </Card>
  );
}
