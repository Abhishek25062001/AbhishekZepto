import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerBrand } from '../types/customer-brand.types';

type BrandCardProps = {
  brand: CustomerBrand;
  onPress: (brand: CustomerBrand) => void;
};

export function BrandCard({ brand, onPress }: BrandCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(brand)}
      style={styles.card}
    >
      <Text variant="small">{brand.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginRight: spacing.sm,
    padding: spacing.md,
    width: 120,
  },
});
