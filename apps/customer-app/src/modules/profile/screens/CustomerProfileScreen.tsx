import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Loader, ScreenWrapper, Text } from '../../../components/common';
import { isDevelopment } from '../../../config/env';
import type { MainStackParamList } from '../../../app/navigation.types';
import { useCustomerPermissions } from '../../../hooks/useCustomerPermissions';
import { requestPushPermission } from '../../push-notifications/services/customer-push-permission.service';
import { useCustomerPushStore } from '../../push-notifications/store/customer-push.store';
import {
  forceLocalLogout,
  logoutCustomer,
} from '../../../services/auth/logout.service';
import { useAuthStore } from '../../../store/auth.store';
import { spacing } from '../../../theme';
import { logCustomerAuthEvent } from '../../../utils/auth-event-logger';
import { getAuthErrorMessage, type ApiErrorResponse } from '../../../../../../packages/shared/api';
import { ProfileErrorState } from '../components/ProfileErrorState';
import { ProfileForm } from '../components/ProfileForm';
import { useCustomerProfile } from '../hooks/useCustomerProfile';

export function CustomerProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const permissionsQuery = useCustomerPermissions();
  const { profile, isLoading, isError, errorMessage, refetch } = useCustomerProfile();
  const permissionStatus = useCustomerPushStore((state) => state.permissionStatus);
  const setPermissionStatus = useCustomerPushStore((state) => state.setPermissionStatus);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRequestingPushPermission, setIsRequestingPushPermission] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setScreenError(null);

    try {
      await logoutCustomer({ logoutAllDevices: false });
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
          { text: 'Keep session', style: 'cancel' },
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

  const handleRequestPushPermission = async () => {
    setIsRequestingPushPermission(true);
    try {
      setPermissionStatus(await requestPushPermission());
    } finally {
      setIsRequestingPushPermission(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (isError || !profile) {
    return (
      <ScreenWrapper>
        <ProfileErrorState
          message={errorMessage ?? 'Could not load profile.'}
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Text variant="h2">Your profile</Text>
      <ProfileForm profile={profile} />

      <View style={styles.links}>
        <Button
          onPress={() => navigation.navigate('OrderHistory')}
          title="My orders"
          variant="secondary"
        />
        <Button
          onPress={() => navigation.navigate('Addresses', { screen: 'AddressList' })}
          title="Manage addresses"
          variant="secondary"
        />
        <Button
          loading={permissionsQuery.isFetching}
          onPress={() => void permissionsQuery.refetch()}
          title="Refresh permissions"
          variant="secondary"
        />
        <Button
          onPress={() => navigation.navigate('Sessions')}
          title="Manage sessions"
          variant="secondary"
        />
        <Button
          onPress={() => navigation.navigate('NotificationCenter')}
          title="Notification center"
          variant="secondary"
        />
        <View style={styles.pushSection}>
          <Text variant="h3">Notifications</Text>
          <Text color="secondary">Status: {permissionStatus}</Text>
          <Text color="secondary">
            Order updates use push notifications for delivery status changes.
          </Text>
          <Button
            loading={isRequestingPushPermission}
            onPress={handleRequestPushPermission}
            title="Request notification permission"
            variant="secondary"
          />
        </View>
        {screenError ? <Text color="error">{screenError}</Text> : null}
        <Button
          loading={isLoggingOut}
          onPress={handleLogout}
          title="Logout"
          variant="outline"
        />
      </View>

      {isDevelopment ? <DevProfileDebugPanel /> : null}
    </ScreenWrapper>
  );
}

function DevProfileDebugPanel() {
  const customerId = useAuthStore((state) => state.customerId);
  const role = useAuthStore((state) => state.role);
  const permissions = useAuthStore((state) => state.permissions);

  return (
    <View style={styles.devPanel}>
      <Text color="secondary" variant="small">
        Dev: customerId={customerId ?? 'n/a'} role={role ?? 'n/a'} permissions={permissions.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  devPanel: {
    marginTop: spacing.lg,
  },
  links: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  pushSection: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
});
