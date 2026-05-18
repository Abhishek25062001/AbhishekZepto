import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ErrorView, Loader, ScreenWrapper, Text } from '../../components/common';
import { API_BASE_URL, APP_ENV } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useCustomerPermissions } from '../../hooks/useCustomerPermissions';
import { useAuthStore } from '../../store/auth.store';
import { colors, radius, spacing } from '../../theme';

export function DebugScreen() {
  const { error, healthData, isLoading } = useBackendHealth();
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const customerId = useAuthStore((state) => state.customerId);
  const cityId = useAuthStore((state) => state.cityId);
  const role = useAuthStore((state) => state.role);
  const permissions = useAuthStore((state) => state.permissions);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const permissionsQuery = useCustomerPermissions();

  return (
    <ScreenWrapper>
      <Text variant="h2">Customer Debug</Text>
      <View style={styles.panel}>
        <Text variant="h3">Runtime status</Text>
        <Text color="secondary" variant="small">
          Environment: {APP_ENV}
        </Text>
        <Text color="secondary" variant="small">
          API base URL: {API_BASE_URL}
        </Text>
        {isLoading ? <Loader /> : null}
        {error ? <ErrorView message="Unable to reach backend health API." /> : null}
        {healthData ? (
          <Text
            color={
              healthData.database.status === 'connected' ? 'success' : 'warning'
            }
            variant="small"
          >
            Backend health: {healthData.service} {healthData.status}
          </Text>
        ) : null}
      </View>
      <View style={styles.panel}>
        <Text variant="h3">Auth state</Text>
        <Text color="secondary" variant="small">
          Authenticated: {isAuthenticated ? 'Yes' : 'No'}
        </Text>
        <Text color="secondary" variant="small">
          Customer ID: {customerId ?? 'Not available'}
        </Text>
        <Text color="secondary" variant="small">
          City ID: {cityId ?? 'Not available'}
        </Text>
        <Text color="secondary" variant="small">
          Role: {role ?? 'Not available'}
        </Text>
        <Text color="secondary" variant="small">
          Permissions count: {permissions.length}
        </Text>
        <Text color="secondary" variant="small">
          Access token: {accessToken ? 'Stored' : 'Missing'}
        </Text>
        <Text color="secondary" variant="small">
          Refresh token: {refreshToken ? 'Stored' : 'Missing'}
        </Text>
        <Button
          loading={permissionsQuery.isFetching}
          onPress={() => void permissionsQuery.refetch()}
          title="Refresh auth permissions"
          variant="secondary"
        />
        {permissionsQuery.data ? (
          <Text color="secondary" variant="small">
            Permissions response: role={permissionsQuery.data.role}, permissions=
            {permissionsQuery.data.permissions.length}
          </Text>
        ) : null}
        {permissionsQuery.error ? (
          <Text color="error" variant="small">
            Failed to fetch customer permissions.
          </Text>
        ) : null}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
});
