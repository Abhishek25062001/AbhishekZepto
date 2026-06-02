import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Button, ErrorView, Loader } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { PlatformSettingAuditTable } from '../components/PlatformSettingAuditTable';
import { PlatformSettingSummary } from '../components/PlatformSettingSummary';
import { PlatformSettingUpdateForm } from '../components/PlatformSettingUpdateForm';
import { usePlatformSettingAudit } from '../hooks/usePlatformSettingAudit';
import { usePlatformSettingDetail } from '../hooks/usePlatformSettingDetail';

export function PlatformSettingDetailPage() {
  const { settingKey = '' } = useParams();
  const decodedSettingKey = decodeURIComponent(settingKey);
  const detailQuery = usePlatformSettingDetail(decodedSettingKey);
  const auditQuery = usePlatformSettingAudit(decodedSettingKey);
  const setting = detailQuery.data;

  if (detailQuery.isLoading) {
    return <Loader label="Loading platform setting..." />;
  }

  if (detailQuery.error || !setting) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load platform setting.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load platform setting"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/settings/platform">Back to settings</Link>
          <h1 style={{ margin: 0 }}>{setting.key}</h1>
        </div>
        <Button onClick={() => void detailQuery.refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <PlatformSettingSummary setting={setting} />

      <CanAccess permission="settings:manage">
        <PlatformSettingUpdateForm setting={setting} />
      </CanAccess>

      {auditQuery.error ? (
        <ErrorView
          message={getApiErrorMessage(auditQuery.error, 'Unable to load platform setting audit.')}
          onRetry={() => void auditQuery.refetch()}
          title="Unable to load audit"
        />
      ) : null}

      {!auditQuery.error ? (
        <PlatformSettingAuditTable
          audit={auditQuery.data ?? []}
          loading={auditQuery.isLoading}
        />
      ) : null}
    </div>
  );
}
