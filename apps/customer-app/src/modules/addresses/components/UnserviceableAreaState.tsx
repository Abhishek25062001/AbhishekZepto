import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

type UnserviceableAreaStateProps = {
  message?: string;
  onChangeAddress: () => void;
};

export function UnserviceableAreaState({
  message = 'We do not deliver to this location yet.',
  onChangeAddress,
}: UnserviceableAreaStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Area not serviceable</Text>
      <Text color="secondary" variant="body">
        {message}
      </Text>
      <Button onPress={onChangeAddress} title="Change address" variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    gap: spacing.md,
    padding: spacing.lg,
  },
});
