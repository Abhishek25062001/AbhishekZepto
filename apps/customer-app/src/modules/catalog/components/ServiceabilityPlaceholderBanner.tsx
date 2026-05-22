import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import { useLocationContext } from '../../addresses/hooks/useLocationContext';

export function ServiceabilityPlaceholderBanner() {
  const { hasStore, selectedStoreName } = useLocationContext();

  if (hasStore) {
    return selectedStoreName ? (
      <View style={styles.storeBanner}>
        <Text variant="small">Delivering from {selectedStoreName}</Text>
      </View>
    ) : null;
  }

  return (
    <View style={styles.banner}>
      <Text variant="small">
        Set your delivery location to see accurate availability and pricing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  storeBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
});
