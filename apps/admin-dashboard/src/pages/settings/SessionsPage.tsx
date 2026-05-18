import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '../../components/common';
import { useAdminSessions } from '../../hooks/useAdminSessions';
import {
  logoutOtherSessions as logoutOtherSessionsApi,
  logoutSession as logoutSessionApi,
} from '../../services/api/auth.api';
import {
  formatSessionDeviceLabel,
  formatSessionTimestamp,
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';

const confirmDestructiveAction = (message: string) => window.confirm(message);

export function SessionsPage() {
  const sessionsQuery = useAdminSessions();
  const [isManagingSessions, setIsManagingSessions] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);

  const handleLogoutSession = async (sessionId: string, deviceLabel: string) => {
    if (!confirmDestructiveAction(`Revoke the session on ${deviceLabel}?`)) {
      return;
    }

    setIsManagingSessions(true);
    setScreenError(null);

    try {
      await logoutSessionApi({ sessionId });
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

  const handleLogoutOtherSessions = async () => {
    if (!confirmDestructiveAction('Revoke every other active session for this account?')) {
      return;
    }

    setIsManagingSessions(true);
    setScreenError(null);

    try {
      await logoutOtherSessionsApi();
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

  const sessions = sessionsQuery.data ?? [];
  const activeOtherSessions = sessions.filter(
    (session) => !session.isCurrent && !session.isRevoked,
  );

  return (
    <>
      <h1>Sessions</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Manage your admin sign-ins. Tokens and secrets are never displayed on this page.
      </p>
      <p>
        <Link to="/settings">Back to settings</Link>
      </p>

      <Card
        description="Uses the shared auth session APIs for the signed-in admin user."
        title="Your sessions"
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
          <button
            disabled={sessionsQuery.isFetching}
            onClick={() => void sessionsQuery.refetch()}
            type="button"
          >
            {sessionsQuery.isFetching ? 'Refreshing sessions...' : 'Refresh sessions'}
          </button>
          <button
            disabled={isManagingSessions || activeOtherSessions.length === 0}
            onClick={() => void handleLogoutOtherSessions()}
            type="button"
          >
            {isManagingSessions ? 'Updating sessions...' : 'Logout other sessions'}
          </button>
        </div>

        {sessionsQuery.isLoading ? <p>Loading sessions...</p> : null}
        {sessionsQuery.error ? (
          <p style={{ color: 'var(--color-error)' }}>Unable to load admin sessions right now.</p>
        ) : null}
        {!sessionsQuery.isLoading && !sessionsQuery.error && sessions.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No sessions found.</p>
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
                <strong>
                  {session.isCurrent
                    ? 'Current session'
                    : session.isRevoked
                      ? 'Revoked session'
                      : 'Other session'}
                </strong>
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
                {!session.isCurrent && !session.isRevoked ? (
                  <button
                    disabled={isManagingSessions}
                    onClick={() => void handleLogoutSession(session.id, deviceLabel)}
                    type="button"
                  >
                    Revoke this session
                  </button>
                ) : null}
              </section>
            );
          })}
        </div>
      </Card>

      {screenError ? <p style={{ color: 'var(--color-error)' }}>{screenError}</p> : null}
    </>
  );
}
