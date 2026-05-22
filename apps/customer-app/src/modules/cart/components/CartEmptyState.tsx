import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';

type CartEmptyStateProps = {
  onStartShopping: () => void;
};

export function CartEmptyState({ onStartShopping }: CartEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Your cart is empty</Text>
      <Text color="secondary" variant="small">
        Add items from home or catalog to get started.
      </Text>
      <Button onPress={onStartShopping} title="Start shopping" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
});
