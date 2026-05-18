import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../../theme';

export function CatalogListSkeleton() {
  return (
    <View style={styles.row}>
      {[0, 1, 2].map((key) => (
        <View key={key} style={styles.item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.border,
    borderRadius: radius.md,
    height: 80,
    marginRight: spacing.sm,
    width: 100,
  },
  row: {
    flexDirection: 'row',
    marginVertical: spacing.md,
  },
});
