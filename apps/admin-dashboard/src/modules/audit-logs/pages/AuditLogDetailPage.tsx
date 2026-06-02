import { Link, useParams } from 'react-router-dom';

import { Badge, Button, Card, ErrorView, Loader } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { AuditLogStatePanel } from '../components/AuditLogStatePanel';
import { useAuditLogDetail } from '../hooks/useAuditLogDetail';
import {
  formatAuditLogDate,
  formatAuditLogLabel,
} from '../utils/audit-log-display.util';

const metadataGridStyle = {
  display: 'grid',
  gap: 'var(--spacing-md)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
} as const;

export function AuditLogDetailPage() {
  const { auditLogId = '' } = useParams();
  const detailQuery = useAuditLogDetail(auditLogId);
  const auditLog = detailQuery.data;

  if (detailQuery.isLoading) {
    return <Loader label="Loading audit log..." />;
  }

  if (detailQuery.error || !auditLog) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load audit log.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load audit log"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/audit-logs">Back to audit logs</Link>
          <h1 style={{ margin: 0 }}>{formatAuditLogLabel(auditLog.actionType)}</h1>
        </div>
        <Button onClick={() => void detailQuery.refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <Card title="Audit metadata">
        <div style={metadataGridStyle}>
          <div>
            <strong>Action</strong>
            <p><Badge>{formatAuditLogLabel(auditLog.actionType)}</Badge></p>
          </div>
          <div>
            <strong>Admin ID</strong>
            <p>{auditLog.adminId}</p>
          </div>
          <div>
            <strong>Entity</strong>
            <p>{auditLog.entityType} / {auditLog.entityId}</p>
          </div>
          <div>
            <strong>Reason</strong>
            <p>{auditLog.reason}</p>
          </div>
          <div>
            <strong>IP address</strong>
            <p>{auditLog.ipAddress ?? 'Not available'}</p>
          </div>
          <div>
            <strong>Device</strong>
            <p>{auditLog.deviceInfo ?? 'Not available'}</p>
          </div>
          <div>
            <strong>Created</strong>
            <p>{formatAuditLogDate(auditLog.createdAt)}</p>
          </div>
          <div>
            <strong>Updated</strong>
            <p>{formatAuditLogDate(auditLog.updatedAt)}</p>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 'var(--spacing-xl)', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <AuditLogStatePanel state={auditLog.beforeState} title="Before state" />
        <AuditLogStatePanel state={auditLog.afterState} title="After state" />
      </div>
    </div>
  );
}
