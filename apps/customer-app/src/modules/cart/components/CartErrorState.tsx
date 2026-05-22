import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';

type CartErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function CartErrorState({ message, onRetry }: CartErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Could not load cart</Text>
      <Text color="secondary" variant="small">
        {message}
      </Text>
      <Button onPress={onRetry} title="Try again" variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
});
