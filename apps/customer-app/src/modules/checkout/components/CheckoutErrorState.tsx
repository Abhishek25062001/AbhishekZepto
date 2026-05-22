import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';

type CheckoutErrorStateProps = {
  message: string;
  primaryLabel: string;
  onPrimaryAction: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
};

export function CheckoutErrorState({
  message,
  primaryLabel,
  onPrimaryAction,
  secondaryLabel,
  onSecondaryAction,
}: CheckoutErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Checkout unavailable</Text>
      <Text color="secondary" variant="small">
        {message}
      </Text>
      <Button onPress={onPrimaryAction} title={primaryLabel} variant="secondary" />
      {secondaryLabel && onSecondaryAction ? (
        <Button onPress={onSecondaryAction} title={secondaryLabel} variant="ghost" />
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
