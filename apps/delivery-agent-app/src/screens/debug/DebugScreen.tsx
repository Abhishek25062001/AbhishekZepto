import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorView, Loader, ScreenWrapper, Text } from '../../components/common';
import { API_BASE_URL, APP_ENV } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { colors, radius, spacing } from '../../theme';

export function DebugScreen() {
  const { error, healthData, isLoading } = useBackendHealth();

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Debug</Text>
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
