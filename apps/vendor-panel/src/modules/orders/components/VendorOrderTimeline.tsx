import { Table, type TableColumn } from '../../../components/common';
import type { VendorOrderDetail } from '../types/vendor-orders.types';

type TimelineRow = VendorOrderDetail['timeline'][number] & Record<string, unknown>;

const formatDateTime = (value: string | null) => (value ? new Date(value).toLocaleString() : 'Not set');

const columns: TableColumn<TimelineRow>[] = [
  { header: 'Event', key: 'event' },
  { header: 'From', key: 'fromStatus', render: (row) => row.fromStatus ?? 'None' },
  { header: 'To', key: 'toStatus', render: (row) => row.toStatus ?? 'None' },
  { header: 'Actor', key: 'actorType', render: (row) => `${row.actorType}${row.actorRole ? ` / ${row.actorRole}` : ''}` },
  { header: 'Reason', key: 'reason', render: (row) => row.reason ?? 'None' },
  { header: 'Created', key: 'createdAt', render: (row) => formatDateTime(row.createdAt) },
];

export function VendorOrderTimeline({ timeline }: { timeline: VendorOrderDetail['timeline'] }) {
  const rows = timeline.map((event) => ({ ...event } as TimelineRow));
  return <Table columns={columns} data={rows} emptyMessage="No timeline events." rowKey={(_row, index) => String(index)} />;
}
