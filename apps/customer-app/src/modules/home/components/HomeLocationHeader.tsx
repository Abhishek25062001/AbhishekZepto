import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

type HomeLocationHeaderProps = {
  storeName: string;
  onChangeLocation: () => void;
};

export function HomeLocationHeader({ onChangeLocation, storeName }: HomeLocationHeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text variant="h2">Shop now</Text>
        <Text color="secondary" variant="small">
          Delivering from {storeName}
        </Text>
      </View>
      <Button onPress={onChangeLocation} title="Change" variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
});
