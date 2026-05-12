import { API_BASE_URL, APP_ENV } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { Badge, Card, ErrorView, Loader } from '../../components/common';

export function DebugPage() {
  const { error, healthData, isLoading } = useBackendHealth();

  return (
    <>
      <h1>Vendor Debug</h1>
      <Card
        description="Local development diagnostics for the vendor panel."
        title="Runtime status"
      >
        <dl>
          <dt>Environment</dt>
          <dd>{APP_ENV}</dd>
          <dt>API base URL</dt>
          <dd>{API_BASE_URL}</dd>
          <dt>Backend health</dt>
          <dd>
            {isLoading ? <Loader label="Checking backend health..." /> : null}
            {error ? (
              <ErrorView message="Unable to reach backend health API." />
            ) : null}
            {healthData ? (
              <Badge
                variant={
                  healthData.database.status === 'connected'
                    ? 'success'
                    : 'warning'
                }
              >
                {healthData.service}: {healthData.status}
              </Badge>
            ) : null}
          </dd>
        </dl>
      </Card>
    </>
  );
}
