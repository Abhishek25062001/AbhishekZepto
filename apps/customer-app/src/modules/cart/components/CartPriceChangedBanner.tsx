import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

type CartPriceChangedBannerProps = {
  isRefreshing?: boolean;
  message?: string;
  onRefresh: () => void;
};

export function CartPriceChangedBanner({
  isRefreshing = false,
  message = 'Prices have changed for items in your cart.',
  onRefresh,
}: CartPriceChangedBannerProps) {
  return (
    <View style={styles.banner}>
      <Text variant="small">{message}</Text>
      <Button
        disabled={isRefreshing}
        onPress={onRefresh}
        title={isRefreshing ? 'Refreshing…' : 'Refresh prices'}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
});
