import React from 'react';
import { Alert } from 'react-native';

import { Button, ScreenWrapper, Text } from '../../components/common';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useDeliveryPermissions } from '../../hooks/useDeliveryPermissions';
import {
  forceLocalLogout,
  logoutDeliveryAgent,
} from '../../services/auth/logout.service';
import { useAuthStore } from '../../store/auth.store';
import { logDeliveryAuthEvent } from '../../utils/auth-event-logger';
import {
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';

export function ProfileScreen() {
  const navigation = useAppNavigation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const cityId = useAuthStore((state) => state.cityId);
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);
  const permissionsQuery = useDeliveryPermissions();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [screenError, setScreenError] = React.useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setScreenError(null);

    try {
      await logoutDeliveryAgent({
        logoutAllDevices: false,
      });
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      logDeliveryAuthEvent('logout_failure', {
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
      <Text variant="h2">Delivery Profile</Text>
      <Text color="secondary">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
      <Text color="secondary">
        Delivery Agent ID: {deliveryAgentId ?? 'Not available'}
      </Text>
      <Text color="secondary">City ID: {cityId ?? 'Not available'}</Text>
      <Text color="secondary">Role: {role ?? 'Not available'}</Text>
      <Text color="secondary">Permissions count: {permissions.length}</Text>
      <Text color="secondary">
        Access token: {accessToken ? 'Stored' : 'Missing'}
      </Text>
      <Button
        accessibilityLabel="Refresh delivery permissions"
        loading={permissionsQuery.isFetching}
        onPress={() => void permissionsQuery.refetch()}
        title="Refresh permissions"
        variant="secondary"
      />
      {permissionsQuery.error ? (
        <Text color="error">Unable to refresh delivery permissions right now.</Text>
      ) : null}
      <Button
        accessibilityLabel="Open delivery sessions screen"
        onPress={() => navigation.navigate('Sessions')}
        title="Manage sessions"
        variant="secondary"
      />
      {screenError ? <Text color="error">{screenError}</Text> : null}
      <Button
        accessibilityLabel="Log out of Delivery Agent App"
        loading={isLoggingOut}
        onPress={handleLogout}
        title="Logout"
        variant="outline"
      />
    </ScreenWrapper>
  );
}
