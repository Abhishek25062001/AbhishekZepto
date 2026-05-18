import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { EmptyState, Table, type TableColumn } from '../../components/common';

type UserRow = {
  id: string;
  role: string;
};

const columns: TableColumn<UserRow>[] = [
  { header: 'User ID', key: 'id' },
  { header: 'Role', key: 'role' },
];

const rows: UserRow[] = [];

const USER_SESSION_READ_PERMISSIONS = [
  'auth:read',
  'users:read',
  'settings:manage',
] as const;

export function UsersPage() {
  const [targetUserId, setTargetUserId] = useState('');

  return (
    <>
      <h1>Users</h1>
      <Table columns={columns} data={rows} emptyMessage="No users yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState
          description="User management data will be added in the user module."
          title="No users yet"
        />
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
    </>
  );
}
