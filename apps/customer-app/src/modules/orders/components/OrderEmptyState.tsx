import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';

type OrderEmptyStateProps = {
  onStartShopping?: () => void;
};

export function OrderEmptyState({ onStartShopping }: OrderEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">No orders yet</Text>
      <Text color="secondary" variant="small">
        Your placed orders will appear here.
      </Text>
      {onStartShopping ? (
        <Button onPress={onStartShopping} title="Start shopping" variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
});
