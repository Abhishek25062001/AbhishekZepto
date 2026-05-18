import { Button, Card } from '../../components/common';
import { useVendorPermissions } from '../../hooks/useVendorPermissions';

export function AuthSmokeTestPage() {
  const permissionsQuery = useVendorPermissions();

  return (
    <>
      <h1>Vendor Auth Smoke Test</h1>
      <Card
        description="Development-only vendor auth verification surface."
        title="Protected vendor auth call"
      >
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          <Button
            loading={permissionsQuery.isFetching}
            onClick={() => void permissionsQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Fetch vendor permissions
          </Button>
          {permissionsQuery.error ? (
            <p style={{ color: 'var(--color-error)', margin: 0 }}>
              Unable to fetch vendor permissions right now.
            </p>
          ) : null}
          {permissionsQuery.data ? (
            <dl style={{ display: 'grid', gap: '6px', margin: 0 }}>
              <div>
                <dt>Vendor user ID</dt>
                <dd>{permissionsQuery.data.vendorUserId}</dd>
              </div>
              <div>
                <dt>Vendor ID</dt>
                <dd>{permissionsQuery.data.vendorId ?? 'Not available'}</dd>
              </div>
              <div>
                <dt>Store ID</dt>
                <dd>{permissionsQuery.data.storeId ?? 'Not available'}</dd>
              </div>
              <div>
                <dt>Permission count</dt>
                <dd>{permissionsQuery.data.permissions.length}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </Card>
    </>
  );
}
