import { Badge } from '../../../components/common';
import type { DataExportStatus } from '../types/data-export.types';

type DataExportStatusBadgeProps = {
  status: DataExportStatus;
};

const statusVariant: Record<DataExportStatus, 'error' | 'info' | 'success'> = {
  completed: 'success',
  failed: 'error',
  queued: 'info',
};

export function DataExportStatusBadge({ status }: DataExportStatusBadgeProps) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
