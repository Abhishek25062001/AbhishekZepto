import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { AdminUsersFilterBar } from '../../modules/admin-users/components/AdminUsersFilterBar';
import { AdminUsersTable } from '../../modules/admin-users/components/AdminUsersTable';
import { CreateAdminUserModal } from '../../modules/admin-users/components/CreateAdminUserModal';
import { useAdminUsers } from '../../modules/admin-users/hooks/useAdminUsers';
import type { AdminUserListQuery } from '../../modules/admin-users/types/admin-users.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

const USER_SESSION_READ_PERMISSIONS = [
  'auth:read',
  'users:read',
  'settings:manage',
] as const;

const ADMIN_USER_CREATE_PERMISSIONS = ['users:create', 'settings:manage'] as const;

export function UsersPage() {
  const [targetUserId, setTargetUserId] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<AdminUserListQuery>({ page: 1, limit: 20 });
  const { data, error, isLoading, refetch } = useAdminUsers(filters);
  const users = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>Users</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <CanAccessAny permissions={ADMIN_USER_CREATE_PERMISSIONS}>
            <Button onClick={() => setCreateOpen(true)} type="button">
              Create User
            </Button>
          </CanAccessAny>
          <Button onClick={() => void refetch()} type="button" variant="outline">
            Refresh
          </Button>
        </div>
      </header>

      <AdminUsersFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load admin users.')}
          onRetry={() => void refetch()}
          title="Unable to load users"
        />
      ) : null}

      {isLoading ? <Loader label="Loading admin users..." /> : null}

      {!error ? <AdminUsersTable loading={isLoading} users={users} /> : null}

      {!isLoading && !error && users.length === 0 ? (
        <EmptyState description="No admin users match the current filters." title="No users found" />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} users
          </span>
          <Button
            disabled={!pagination.hasPreviousPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: Math.max(1, (previous.page ?? 1) - 1),
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: (previous.page ?? 1) + 1,
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </footer>
      ) : null}

      <CanAccessAny permissions={USER_SESSION_READ_PERMISSIONS}>
        <section style={{ marginTop: 'var(--spacing-xl)' }}>
          <h2>Manage user sessions</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Enter a user ID to open the admin user-session page backed by Ticket 11 APIs.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--spacing-md)' }}>
            <input
              aria-label="Target user ID"
              onChange={(event) => setTargetUserId(event.target.value.trim())}
              placeholder="User ID"
              style={{ minWidth: '280px', padding: '8px' }}
              value={targetUserId}
            />
            {targetUserId ? (
              <Link to={`/users/${targetUserId}/sessions`}>Open user sessions</Link>
            ) : (
              <span style={{ color: 'var(--color-text-secondary)' }}>Enter a user ID</span>
            )}
          </div>
        </section>
      </CanAccessAny>

      <CreateAdminUserModal onClose={() => setCreateOpen(false)} open={createOpen} />
    </div>
  );
}
