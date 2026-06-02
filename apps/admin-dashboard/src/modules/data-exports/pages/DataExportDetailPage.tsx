import { Link, useParams } from 'react-router-dom';

import { Button, Card, ErrorView, Loader } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { DataExportMetadataPanel } from '../components/DataExportMetadataPanel';
import { useDataExportDetail } from '../hooks/useDataExportDetail';
import { formatDataExportLabel } from '../utils/data-export-display.util';

export function DataExportDetailPage() {
  const { exportId = '' } = useParams();
  const detailQuery = useDataExportDetail(exportId);
  const dataExport = detailQuery.data;

  if (detailQuery.isLoading) {
    return <Loader label="Loading export request..." />;
  }

  if (detailQuery.error || !dataExport) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load export request.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load export request"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/exports">Back to exports</Link>
          <h1 style={{ margin: 0 }}>{formatDataExportLabel(dataExport.exportType)}</h1>
        </div>
        <Button onClick={() => void detailQuery.refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <DataExportMetadataPanel dataExport={dataExport} />

      <Card title="Filters">
        <pre
          style={{
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            margin: 0,
            maxHeight: 360,
            overflow: 'auto',
            padding: 'var(--spacing-md)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {JSON.stringify(dataExport.filters, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
