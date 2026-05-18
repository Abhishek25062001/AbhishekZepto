import { Button, Card } from '../../components/common';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';

export function AuthSmokeTestPage() {
  const permissionsQuery = useAdminPermissions();

  return (
    <>
      <h1>Admin Auth Smoke Test</h1>
      <Card
        description="Development-only admin auth verification surface."
        title="Protected admin auth call"
      >
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          <Button
            loading={permissionsQuery.isFetching}
            onClick={() => void permissionsQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Fetch admin permissions
          </Button>
          {permissionsQuery.error ? (
            <p style={{ color: 'var(--color-error)', margin: 0 }}>
              Unable to fetch admin permissions right now.
            </p>
          ) : null}
          {permissionsQuery.data ? (
            <dl style={{ display: 'grid', gap: '6px', margin: 0 }}>
              <div>
                <dt>Admin ID</dt>
                <dd>{permissionsQuery.data.adminId}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{permissionsQuery.data.role}</dd>
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
