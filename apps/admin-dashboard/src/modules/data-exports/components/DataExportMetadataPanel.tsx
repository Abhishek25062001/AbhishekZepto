import { Card } from '../../../components/common';
import type { DataExportRecord } from '../types/data-export.types';
import {
  formatDataExportDate,
  formatDataExportLabel,
} from '../utils/data-export-display.util';
import { DataExportStatusBadge } from './DataExportStatusBadge';

type DataExportMetadataPanelProps = {
  dataExport: DataExportRecord;
};

const metadataGridStyle = {
  display: 'grid',
  gap: 'var(--spacing-md)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
} as const;

const nullable = (value: string | null) => value ?? 'Not available';

export function DataExportMetadataPanel({ dataExport }: DataExportMetadataPanelProps) {
  return (
    <Card title="Export metadata">
      <div style={metadataGridStyle}>
        <div>
          <strong>Export type</strong>
          <p>{formatDataExportLabel(dataExport.exportType)}</p>
        </div>
        <div>
          <strong>Format</strong>
          <p>{dataExport.format.toUpperCase()}</p>
        </div>
        <div>
          <strong>Status</strong>
          <p><DataExportStatusBadge status={dataExport.status} /></p>
        </div>
        <div>
          <strong>Requested by</strong>
          <p>{dataExport.requestedByAdminId}</p>
        </div>
        <div>
          <strong>Requested</strong>
          <p>{formatDataExportDate(dataExport.requestedAt)}</p>
        </div>
        <div>
          <strong>Completed</strong>
          <p>{formatDataExportDate(dataExport.completedAt)}</p>
        </div>
        <div>
          <strong>Failed</strong>
          <p>{formatDataExportDate(dataExport.failedAt)}</p>
        </div>
        <div>
          <strong>Failure reason</strong>
          <p>{nullable(dataExport.failureReason)}</p>
        </div>
        <div>
          <strong>File key</strong>
          <p>{nullable(dataExport.fileKey)}</p>
        </div>
        <div>
          <strong>File name</strong>
          <p>{nullable(dataExport.fileName)}</p>
        </div>
        <div>
          <strong>Download URL</strong>
          <p>{nullable(dataExport.downloadUrl)}</p>
        </div>
        <div>
          <strong>Expires</strong>
          <p>{formatDataExportDate(dataExport.expiresAt)}</p>
        </div>
        <div>
          <strong>Created</strong>
          <p>{formatDataExportDate(dataExport.createdAt)}</p>
        </div>
        <div>
          <strong>Updated</strong>
          <p>{formatDataExportDate(dataExport.updatedAt)}</p>
        </div>
      </div>
    </Card>
  );
}
