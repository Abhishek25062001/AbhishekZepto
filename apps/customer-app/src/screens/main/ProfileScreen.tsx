import React from 'react';
import { Alert } from 'react-native';

import { Button, ScreenWrapper, Text } from '../../components/common';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useCustomerPermissions } from '../../hooks/useCustomerPermissions';
import {
  forceLocalLogout,
  logoutCustomer,
} from '../../services/auth/logout.service';
import { useAuthStore } from '../../store/auth.store';
import { logCustomerAuthEvent } from '../../utils/auth-event-logger';
import { getAuthErrorMessage, type ApiErrorResponse } from '../../../../../packages/shared/api';

export function ProfileScreen() {
  const navigation = useAppNavigation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const cityId = useAuthStore((state) => state.cityId);
  const customerId = useAuthStore((state) => state.customerId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);
  const permissionsQuery = useCustomerPermissions();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [screenError, setScreenError] = React.useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setScreenError(null);

    try {
      await logoutCustomer({
        logoutAllDevices: false,
      });
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      logCustomerAuthEvent('logout_failure', {
        errorCode: apiError.response?.data?.error.code,
      });
      setScreenError(
        getAuthErrorMessage(
          apiError.response?.data?.error.code,
          apiError.response?.data?.message,
        ),
      );

      Alert.alert(
        'Logout issue',
        'We could not reach the server to finish logout. Do you want to clear this device session anyway?',
        [
          {
            text: 'Keep session',
            style: 'cancel',
          },
          {
            text: 'Clear locally',
            style: 'destructive',
            onPress: () => {
              void forceLocalLogout();
            },
          },
        ],
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ScreenWrapper>
      <Text variant="h2">Customer Profile</Text>
      <Text color="secondary">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
      <Text color="secondary">Customer ID: {customerId ?? 'Not available'}</Text>
      <Text color="secondary">City ID: {cityId ?? 'Not available'}</Text>
      <Text color="secondary">Role: {role ?? 'Not available'}</Text>
      <Text color="secondary">Permissions count: {permissions.length}</Text>
      <Text color="secondary">
        Access token: {accessToken ? 'Stored' : 'Missing'}
      </Text>
      <Button
        accessibilityLabel="Refresh customer permissions"
        loading={permissionsQuery.isFetching}
        onPress={() => void permissionsQuery.refetch()}
        title="Refresh permissions"
        variant="secondary"
      />
      {permissionsQuery.error ? (
        <Text color="error">Unable to refresh customer permissions right now.</Text>
      ) : null}
      <Button
        accessibilityLabel="Open customer sessions screen"
        onPress={() => navigation.navigate('Sessions')}
        title="Manage sessions"
        variant="secondary"
      />
      {screenError ? <Text color="error">{screenError}</Text> : null}
      <Button
        accessibilityLabel="Log out of Customer App"
        loading={isLoggingOut}
        onPress={handleLogout}
        title="Logout"
        variant="outline"
      />
    </ScreenWrapper>
  );
}
