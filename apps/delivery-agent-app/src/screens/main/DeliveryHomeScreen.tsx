import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorView, Loader, ScreenWrapper, Text } from '../../components/common';
import { isDevelopment } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { colors, radius, spacing } from '../../theme';

export function DeliveryHomeScreen() {
  const { healthData, isLoading, error } = useBackendHealth();

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Home</Text>
      {isDevelopment ? (
        <View style={styles.healthPanel}>
          <Text variant="h3">Backend health</Text>
          {isLoading ? <Loader /> : null}
          {error ? <ErrorView message="Unable to reach backend health API." /> : null}
          {healthData ? (
            <Text color="secondary" variant="small">
              {healthData.service}: {healthData.status}
            </Text>
          ) : null}
        </View>
      ) : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  healthPanel: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
});
