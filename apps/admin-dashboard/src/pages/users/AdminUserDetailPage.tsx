import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Button, ErrorView, Loader } from '../../components/common';
import { AdminUserAuditTable } from '../../modules/admin-users/components/AdminUserAuditTable';
import { AdminUserPermissionsControl } from '../../modules/admin-users/components/AdminUserPermissionsControl';
import { AdminUserRoleControl } from '../../modules/admin-users/components/AdminUserRoleControl';
import { AdminUserStatusControl } from '../../modules/admin-users/components/AdminUserStatusControl';
import { AdminUserSummary } from '../../modules/admin-users/components/AdminUserSummary';
import { EditAdminUserModal } from '../../modules/admin-users/components/EditAdminUserModal';
import { useAdminUserAudit } from '../../modules/admin-users/hooks/useAdminUserAudit';
import { useAdminUserDetail } from '../../modules/admin-users/hooks/useAdminUserDetail';
import { getApiErrorMessage } from '../../utils/error-message.util';

const ADMIN_USER_UPDATE_PERMISSIONS = ['users:update', 'settings:manage'] as const;
const ADMIN_USER_STATUS_PERMISSIONS = ['users:update-status', 'settings:manage'] as const;
const ADMIN_USER_SETTINGS_PERMISSIONS = ['settings:manage'] as const;

export function AdminUserDetailPage() {
  const { adminUserId } = useParams<{ adminUserId: string }>();
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  if (!adminUserId) {
    return <Navigate replace to="/users" />;
  }

  const detailQuery = useAdminUserDetail(adminUserId);
  const auditQuery = useAdminUserAudit(adminUserId);

  if (detailQuery.isLoading) {
    return <Loader label="Loading admin user..." mode="page" />;
  }

  if (detailQuery.error) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load admin user.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load admin user"
      />
    );
  }

  if (!detailQuery.data) {
    return <Navigate replace to="/users" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/users">Back to users</Link>
          <h1 style={{ marginBottom: 0 }}>Admin User Detail</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <CanAccessAny permissions={ADMIN_USER_UPDATE_PERMISSIONS}>
            <Button onClick={() => setEditOpen(true)} type="button">
              Edit Profile
            </Button>
          </CanAccessAny>
          <CanAccessAny permissions={ADMIN_USER_STATUS_PERMISSIONS}>
            <Button onClick={() => setStatusOpen(true)} type="button" variant="danger">
              Change Status
            </Button>
          </CanAccessAny>
          <CanAccessAny permissions={ADMIN_USER_SETTINGS_PERMISSIONS}>
            <Button onClick={() => setRoleOpen(true)} type="button" variant="secondary">
              Change Role
            </Button>
            <Button onClick={() => setPermissionsOpen(true)} type="button" variant="secondary">
              Direct Permissions
            </Button>
          </CanAccessAny>
          <Button onClick={() => {
            void detailQuery.refetch();
            void auditQuery.refetch();
          }} type="button" variant="outline">
            Refresh
          </Button>
        </div>
      </header>

      <AdminUserSummary user={detailQuery.data} />

      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2 style={{ margin: 0 }}>Audit History</h2>
        {auditQuery.error ? (
          <ErrorView
            message={getApiErrorMessage(auditQuery.error, 'Unable to load admin user audit.')}
            onRetry={() => void auditQuery.refetch()}
            title="Unable to load audit"
          />
        ) : null}
        {!auditQuery.error ? (
          <AdminUserAuditTable audit={auditQuery.data ?? []} loading={auditQuery.isLoading} />
        ) : null}
      </section>

      <EditAdminUserModal
        onClose={() => setEditOpen(false)}
        open={editOpen}
        user={detailQuery.data}
      />
      <AdminUserStatusControl
        onClose={() => setStatusOpen(false)}
        open={statusOpen}
        user={detailQuery.data}
      />
      <AdminUserRoleControl
        onClose={() => setRoleOpen(false)}
        open={roleOpen}
        user={detailQuery.data}
      />
      <AdminUserPermissionsControl
        onClose={() => setPermissionsOpen(false)}
        open={permissionsOpen}
        user={detailQuery.data}
      />
    </div>
  );
}
