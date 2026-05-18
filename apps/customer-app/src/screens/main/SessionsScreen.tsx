import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button, Loader, ScreenWrapper, Text } from '../../components/common';
import { useCustomerSessions } from '../../hooks/useCustomerSessions';
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

const confirmDestructiveAction = (
  title: string,
  message: string,
  onConfirm: () => void,
) => {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Confirm', style: 'destructive', onPress: onConfirm },
  ]);
};

export function SessionsScreen() {
  const sessionsQuery = useCustomerSessions();
  const [isManagingSessions, setIsManagingSessions] = React.useState(false);
  const [screenError, setScreenError] = React.useState<string | null>(null);

  const handleLogoutSession = (sessionId: string, deviceLabel: string) => {
    confirmDestructiveAction(
      'Revoke session',
      `Revoke the session on ${deviceLabel}?`,
      () => {
        void (async () => {
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
        })();
      },
    );
  };

  const handleLogoutOtherSessions = () => {
    confirmDestructiveAction(
      'Logout other sessions',
      'Revoke every other active session for this account?',
      () => {
        void (async () => {
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
        })();
      },
    );
  };

  const sessions = sessionsQuery.data ?? [];
  const activeOtherSessions = sessions.filter(
    (session) => !session.isCurrent && !session.isRevoked,
  );

  return (
    <ScreenWrapper>
      <Text variant="h2">Sessions</Text>
      <Text color="secondary">
        Review devices signed in to your customer account. Secrets are never shown here.
      </Text>

      <View style={styles.actions}>
        <Button
          accessibilityLabel="Refresh customer sessions"
          loading={sessionsQuery.isFetching}
          onPress={() => void sessionsQuery.refetch()}
          title="Refresh sessions"
          variant="secondary"
        />
        <Button
          accessibilityLabel="Log out of other customer sessions"
          disabled={activeOtherSessions.length === 0}
          loading={isManagingSessions}
          onPress={handleLogoutOtherSessions}
          title="Logout other sessions"
          variant="outline"
        />
      </View>

      {sessionsQuery.isLoading ? <Loader /> : null}
      {sessionsQuery.error ? (
        <Text color="error">Unable to load customer sessions right now.</Text>
      ) : null}
      {!sessionsQuery.isLoading && !sessionsQuery.error && sessions.length === 0 ? (
        <Text color="secondary">No sessions found for this account.</Text>
      ) : null}

      {sessions.map((session) => {
        const deviceLabel = formatSessionDeviceLabel(session);

        return (
          <View key={session.id} style={styles.sessionCard}>
            <Text variant="h3">
              {session.isCurrent ? 'Current session' : session.isRevoked ? 'Revoked session' : 'Other session'}
            </Text>
            <Text color="secondary">{deviceLabel}</Text>
            <Text color="secondary">Last used: {formatSessionTimestamp(session.lastUsedAt)}</Text>
            <Text color="secondary">Expires: {formatSessionTimestamp(session.expiresAt)}</Text>
            {session.isRevoked ? (
              <Text color="secondary">
                Revoked: {formatSessionTimestamp(session.revokedAt)}
              </Text>
            ) : null}
            {!session.isCurrent && !session.isRevoked ? (
              <Button
                accessibilityLabel={`Revoke session ${deviceLabel}`}
                loading={isManagingSessions}
                onPress={() => handleLogoutSession(session.id, deviceLabel)}
                title="Revoke this session"
                variant="danger"
              />
            ) : null}
          </View>
        );
      })}

      {screenError ? <Text color="error">{screenError}</Text> : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginVertical: 16,
  },
  sessionCard: {
    gap: 8,
    marginBottom: 16,
  },
});
