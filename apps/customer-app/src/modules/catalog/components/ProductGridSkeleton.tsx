import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../../theme';

export function ProductGridSkeleton() {
  return (
    <View style={styles.grid}>
      {[0, 1, 2, 3].map((key) => (
        <View key={key} style={styles.item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    backgroundColor: colors.border,
    borderRadius: radius.md,
    height: 140,
    width: '47%',
  },
});
