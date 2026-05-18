import { API_BASE_URL, APP_ENV } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { Badge, Card, ErrorView, Loader } from '../../components/common';
import { useAuthStore } from '../../store/auth.store';

export function DebugPage() {
  const { error, healthData, isLoading } = useBackendHealth();
  const accessToken = useAuthStore((state) => state.accessToken);
  const adminId = useAuthStore((state) => state.adminId);
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);
  const permissionsQuery = useAdminPermissions();

  return (
    <>
      <h1>Admin Debug</h1>
      <Card
        description="Local development diagnostics for the admin dashboard."
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
      <Card
        description="Safe admin auth diagnostics for development only."
        title="Admin auth state"
      >
        <dl>
          <dt>Admin ID</dt>
          <dd>{adminId ?? 'Not available'}</dd>
          <dt>Role</dt>
          <dd>{role ?? 'Not available'}</dd>
          <dt>Permission count</dt>
          <dd>{permissions.length}</dd>
          <dt>Access token</dt>
          <dd>{accessToken ? 'Stored' : 'Missing'}</dd>
        </dl>
        <button onClick={() => void permissionsQuery.refetch()} type="button">
          {permissionsQuery.isFetching ? 'Refreshing permissions...' : 'Fetch admin permissions'}
        </button>
      </Card>
    </>
  );
}
