import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../components/auth/CanAccess';
import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Card } from '../../components/common';
import { useAdminUserSessions } from '../../hooks/useAdminUserSessions';
import {
  revokeAdminUserSession as revokeAdminUserSessionApi,
  revokeAllAdminUserSessions as revokeAllAdminUserSessionsApi,
} from '../../services/api/user-sessions.api';
import {
  formatSessionDeviceLabel,
  formatSessionTimestamp,
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';

const USER_SESSION_READ_PERMISSIONS = [
  'auth:read',
  'users:read',
  'settings:manage',
] as const;

const confirmDestructiveAction = (message: string) => window.confirm(message);

export function UserSessionsPage() {
  const { userId } = useParams<{ userId: string }>();
  const sessionsQuery = useAdminUserSessions(userId);
  const [isManagingSessions, setIsManagingSessions] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRevokeSession = async (sessionId: string, deviceLabel: string) => {
    if (!userId || !confirmDestructiveAction(`Revoke ${deviceLabel} for user ${userId}?`)) {
      return;
    }

    setIsManagingSessions(true);
    setScreenError(null);
    setStatusMessage(null);

    try {
      const response = await revokeAdminUserSessionApi(userId, sessionId);
      setStatusMessage(
        response.data.alreadyRevoked
          ? 'Session was already revoked.'
          : 'Session revoked successfully.',
      );
      await sessionsQuery.refetch();
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      setScreenError(
        getAuthErrorMessage(
          apiError.response?.data?.error.code,
          apiError.response?.data?.message,
        ),
      );
    } finally {
      setIsManagingSessions(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (
      !userId ||
      !confirmDestructiveAction(`Revoke all active sessions for user ${userId}?`)
    ) {
      return;
    }

    setIsManagingSessions(true);
    setScreenError(null);
    setStatusMessage(null);

    try {
      const response = await revokeAllAdminUserSessionsApi(userId);
      setStatusMessage(`Revoked ${response.data.revokedCount} active session(s).`);
      await sessionsQuery.refetch();
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      setScreenError(
        getAuthErrorMessage(
          apiError.response?.data?.error.code,
          apiError.response?.data?.message,
        ),
      );
    } finally {
      setIsManagingSessions(false);
    }
  };

  const sessions = sessionsQuery.data?.sessions ?? [];
  const activeSessions = sessions.filter((session) => !session.isRevoked);

  return (
    <CanAccessAny
      fallback={
        <p style={{ color: 'var(--color-error)' }}>
          You do not have permission to view user sessions.
        </p>
      }
      permissions={USER_SESSION_READ_PERMISSIONS}
    >
      <>
        <h1>User sessions</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Manage sessions for user {userId ?? 'unknown'}. Tokens and secrets are never shown.
        </p>
        <p>
          <Link to="/users">Back to users</Link>
        </p>

        <Card description="Ticket 11 admin user-session APIs." title="Target user sessions">
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <button
              disabled={sessionsQuery.isFetching || !userId}
              onClick={() => void sessionsQuery.refetch()}
              type="button"
            >
              {sessionsQuery.isFetching ? 'Refreshing sessions...' : 'Refresh sessions'}
            </button>
            <CanAccess permission="auth:manage">
              <button
                disabled={isManagingSessions || activeSessions.length === 0 || !userId}
                onClick={() => void handleRevokeAllSessions()}
                type="button"
              >
                {isManagingSessions ? 'Updating sessions...' : 'Revoke all active sessions'}
              </button>
            </CanAccess>
          </div>

          {!userId ? (
            <p style={{ color: 'var(--color-error)' }}>A valid user ID is required.</p>
          ) : null}
          {sessionsQuery.isLoading ? <p>Loading user sessions...</p> : null}
          {sessionsQuery.error ? (
            <p style={{ color: 'var(--color-error)' }}>Unable to load user sessions right now.</p>
          ) : null}
          {!sessionsQuery.isLoading && !sessionsQuery.error && sessions.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No sessions found for this user.</p>
          ) : null}

          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {sessions.map((session) => {
              const deviceLabel = formatSessionDeviceLabel(session);

              return (
                <section
                  key={session.id}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-md)',
                  }}
                >
                  <strong>{session.isRevoked ? 'Revoked session' : 'Active session'}</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{deviceLabel}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Last used: {formatSessionTimestamp(session.lastUsedAt)}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Expires: {formatSessionTimestamp(session.expiresAt)}
                  </span>
                  {session.isRevoked ? (
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Revoked: {formatSessionTimestamp(session.revokedAt)}
                    </span>
                  ) : null}
                  {!session.isRevoked ? (
                    <CanAccess permission="auth:manage">
                      <button
                        disabled={isManagingSessions}
                        onClick={() => void handleRevokeSession(session.id, deviceLabel)}
                        type="button"
                      >
                        Revoke session
                      </button>
                    </CanAccess>
                  ) : (
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Already revoked
                    </span>
                  )}
                </section>
              );
            })}
          </div>
        </Card>

        {statusMessage ? <p style={{ color: 'var(--color-success)' }}>{statusMessage}</p> : null}
        {screenError ? <p style={{ color: 'var(--color-error)' }}>{screenError}</p> : null}
      </>
    </CanAccessAny>
  );
}
