import { Link } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import type { DataExportRecord } from '../types/data-export.types';
import {
  formatDataExportDate,
  formatDataExportLabel,
  truncateDataExportValue,
} from '../utils/data-export-display.util';
import { DataExportStatusBadge } from './DataExportStatusBadge';

type DataExportTableProps = {
  dataExports: DataExportRecord[];
  loading?: boolean;
};

const columns: TableColumn<DataExportRecord & Record<string, unknown>>[] = [
  {
    header: 'Export',
    key: 'exportType',
    render: row => formatDataExportLabel(row.exportType),
  },
  {
    header: 'Format',
    key: 'format',
    render: row => row.format.toUpperCase(),
  },
  {
    header: 'Status',
    key: 'status',
    render: row => <DataExportStatusBadge status={row.status} />,
  },
  {
    header: 'Requested by',
    key: 'requestedByAdminId',
    render: row => truncateDataExportValue(row.requestedByAdminId),
  },
  {
    header: 'Requested',
    key: 'requestedAt',
    render: row => formatDataExportDate(row.requestedAt),
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: row => formatDataExportDate(row.createdAt),
  },
  {
    header: '',
    key: 'id',
    render: row => <Link to={`/exports/${row.id}`}>View</Link>,
  },
];

export function DataExportTable({ dataExports, loading = false }: DataExportTableProps) {
  return (
    <Table
      columns={columns}
      data={dataExports as Array<DataExportRecord & Record<string, unknown>>}
      emptyMessage="No export requests found."
      loading={loading}
      rowKey="id"
    />
  );
}
