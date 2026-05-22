import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

type CartQuantityStepperProps = {
  disabled?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
};

export function CartQuantityStepper({
  disabled = false,
  onDecrement,
  onIncrement,
  quantity,
}: CartQuantityStepperProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        disabled={disabled}
        onPress={onDecrement}
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        <Text variant="small">−</Text>
      </Pressable>
      <View style={styles.quantity}>
        <Text variant="small">{quantity}</Text>
      </View>
      <Pressable
        accessibilityLabel="Increase quantity"
        disabled={disabled}
        onPress={onIncrement}
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        <Text variant="small">+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    alignItems: 'center',
    minWidth: 24,
  },
});
