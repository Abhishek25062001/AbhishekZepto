import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { ServiceabilityResult } from '../types/serviceability.types';

type StoreSelectionCardProps = {
  serviceability: ServiceabilityResult;
  isLoading?: boolean;
  onConfirm: () => void;
};

export function StoreSelectionCard({
  isLoading,
  onConfirm,
  serviceability,
}: StoreSelectionCardProps) {
  return (
    <View style={styles.card}>
      <Text variant="h3">Nearest store</Text>
      <Text variant="body">{serviceability.storeName}</Text>
      <Text color="secondary" variant="small">
        {serviceability.distanceKm.toFixed(2)} km away
      </Text>
      <Button
        disabled={isLoading}
        onPress={onConfirm}
        title={isLoading ? 'Selecting...' : 'Confirm store'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
});
