import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';

type PaymentErrorStateProps = {
  message: string;
  onRetry: () => void;
  onDismiss?: () => void;
};

export function PaymentErrorState({ message, onRetry, onDismiss }: PaymentErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Payment failed</Text>
      <Text color="secondary" variant="small">
        {message}
      </Text>
      <Button onPress={onRetry} title="Try again" variant="secondary" />
      {onDismiss ? <Button onPress={onDismiss} title="Dismiss" variant="ghost" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
});
