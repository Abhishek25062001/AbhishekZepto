import { API_BASE_URL, APP_ENV } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useVendorPermissions } from '../../hooks/useVendorPermissions';
import { Badge, Card, ErrorView, Loader } from '../../components/common';
import { useAuthStore } from '../../store/auth.store';

export function DebugPage() {
  const { error, healthData, isLoading } = useBackendHealth();
  const accessToken = useAuthStore((state) => state.accessToken);
  const cityId = useAuthStore((state) => state.cityId);
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);
  const storeId = useAuthStore((state) => state.storeId);
  const vendorId = useAuthStore((state) => state.vendorId);
  const vendorUserId = useAuthStore((state) => state.vendorUserId);
  const permissionsQuery = useVendorPermissions();

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
      <Card
        description="Safe vendor auth diagnostics for development only."
        title="Vendor auth state"
      >
        <dl>
          <dt>Vendor user ID</dt>
          <dd>{vendorUserId ?? 'Not available'}</dd>
          <dt>Vendor ID</dt>
          <dd>{vendorId ?? 'Not available'}</dd>
          <dt>Store ID</dt>
          <dd>{storeId ?? 'Not available'}</dd>
          <dt>City ID</dt>
          <dd>{cityId ?? 'Not available'}</dd>
          <dt>Role</dt>
          <dd>{role ?? 'Not available'}</dd>
          <dt>Permission count</dt>
          <dd>{permissions.length}</dd>
          <dt>Access token</dt>
          <dd>{accessToken ? 'Stored' : 'Missing'}</dd>
        </dl>
        <button onClick={() => void permissionsQuery.refetch()} type="button">
          {permissionsQuery.isFetching ? 'Refreshing permissions...' : 'Fetch vendor permissions'}
        </button>
      </Card>
    </>
  );
}
