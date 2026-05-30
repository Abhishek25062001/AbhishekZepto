import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { isDevelopment } from '../../config/env';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { forceLocalLogout, logoutAdminUser } from '../../services/auth/logout.service';
import { useAuthStore } from '../../store/auth.store';
import { AdminNotificationDropdown } from '../../modules/notification-center/components/AdminNotificationDropdown';
import { logAdminAuthEvent } from '../../utils/auth-event-logger';
import {
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';

export function Header() {
  const navigate = useNavigate();
  const adminId = useAuthStore((state) => state.adminId);
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);
  const permissionsQuery = useAdminPermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setScreenError(null);

    try {
      await logoutAdminUser({
        logoutAllDevices: false,
      });
      navigate('/login', { replace: true });
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      logAdminAuthEvent('logout_failure', {
        errorCode: apiError.response?.data?.error.code,
      });
      setScreenError(
        getAuthErrorMessage(
          apiError.response?.data?.error.code,
          apiError.response?.data?.message,
        ),
      );
      const shouldClearLocally = window.confirm(
        'We could not reach the server to finish logout. Clear this browser session anyway?',
      );

      if (shouldClearLocally) {
        await forceLocalLogout();
        navigate('/login', { replace: true });
      }
    }

    setIsLoggingOut(false);
  };

  return (
    <header
      style={{
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
      }}
    >
      <div style={{ display: 'grid', gap: '4px' }}>
        <span>Admin workspace</span>
        {role ? (
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Role: {role}
          </span>
        ) : null}
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Admin ID: {adminId ?? 'Not available'}
        </span>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Permissions: {permissions.length}
        </span>
      </div>
      <div style={{ alignItems: 'flex-end', display: 'grid', gap: '4px' }}>
        {screenError ? (
          <span style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>{screenError}</span>
        ) : null}
        {permissionsQuery.error ? (
          <span style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>
            Unable to refresh admin permissions right now.
          </span>
        ) : null}
        <div style={{ display: 'flex', gap: '8px' }}>
          <AdminNotificationDropdown />
          <button
            aria-label="Refresh admin permissions"
            disabled={permissionsQuery.isFetching}
            onClick={() => void permissionsQuery.refetch()}
            type="button"
          >
            {permissionsQuery.isFetching ? 'Refreshing...' : 'Refresh permissions'}
          </button>
          <Link to="/settings/sessions">Manage sessions</Link>
          {isDevelopment ? <Link to="/debug/auth-smoke">Auth smoke</Link> : null}
        </div>
        <button
          aria-label="Log out of Admin Dashboard"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          type="button"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
}
