import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ErrorView, Loader, ScreenWrapper, Text } from '../../components/common';
import { isDevelopment } from '../../config/env';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useAuthStore } from '../../store/auth.store';
import { colors, radius, spacing } from '../../theme';

export function DeliveryHomeScreen() {
  const navigation = useAppNavigation();
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const cityId = useAuthStore((state) => state.cityId);
  const role = useAuthStore((state) => state.role);
  const { healthData, isLoading, error } = useBackendHealth();

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Home</Text>
      {isDevelopment ? (
        <View style={styles.healthPanel}>
          <Text variant="h3">Delivery auth summary</Text>
          <Text color="secondary" variant="small">
            Delivery Agent ID: {deliveryAgentId ? `${deliveryAgentId.slice(0, 6)}...` : 'Not available'}
          </Text>
          <Text color="secondary" variant="small">
            City ID: {cityId ?? 'Not available'}
          </Text>
          <Text color="secondary" variant="small">
            Role: {role ?? 'Not available'}
          </Text>
        </View>
      ) : null}
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
      <Button
        onPress={() => navigation.navigate('Profile')}
        title="Open profile"
        variant="secondary"
      />
      <Button
        onPress={() => navigation.navigate('Sessions')}
        title="Manage sessions"
        variant="secondary"
      />
      {isDevelopment ? (
        <Button
          onPress={() => navigation.navigate('AuthSmokeTest')}
          title="Open auth smoke test"
          variant="ghost"
        />
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
