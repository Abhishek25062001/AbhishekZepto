import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';

type OrderErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function OrderErrorState({ message, onRetry }: OrderErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Something went wrong</Text>
      <Text color="secondary" variant="small">
        {message}
      </Text>
      {onRetry ? <Button onPress={onRetry} title="Try again" variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
});
