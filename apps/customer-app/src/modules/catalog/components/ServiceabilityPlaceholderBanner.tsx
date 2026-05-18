import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

export function ServiceabilityPlaceholderBanner() {
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
});
