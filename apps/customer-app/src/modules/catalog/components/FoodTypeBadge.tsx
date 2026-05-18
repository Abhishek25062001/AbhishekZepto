import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import { CUSTOMER_FOOD_TYPE_LABELS } from '../constants/customer-catalog.constants';
import type { FoodType } from '../types/customer-product.types';

type FoodTypeBadgeProps = {
  foodType: Exclude<FoodType, null>;
};

export function FoodTypeBadge({ foodType }: FoodTypeBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text variant="small">{CUSTOMER_FOOD_TYPE_LABELS[foodType]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
