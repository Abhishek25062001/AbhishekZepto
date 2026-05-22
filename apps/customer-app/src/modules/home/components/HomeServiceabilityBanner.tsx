import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

type HomeServiceabilityBannerProps = {
  message: string;
};

export function HomeServiceabilityBanner({ message }: HomeServiceabilityBannerProps) {
  return (
    <View style={styles.banner}>
      <Text variant="small">{message}</Text>
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
