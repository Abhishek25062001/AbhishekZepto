import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerCategory } from '../types/customer-category.types';

type CategoryCardProps = {
  category: CustomerCategory;
  onPress: (category: CustomerCategory) => void;
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(category)}
      style={styles.card}
    >
      <View style={styles.iconPlaceholder} />
      <Text variant="small">{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginRight: spacing.sm,
    padding: spacing.sm,
    width: 100,
  },
  iconPlaceholder: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    height: 48,
    marginBottom: spacing.xs,
    width: 48,
  },
});
