import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors } from '../../../theme';
import { spacing } from '../../../theme';
import { getProductPriceDisplay } from './product-price-display.util';

type ProductPriceBlockProps = {
  finalPrice?: number | null;
  mrp?: number | null;
};

export function ProductPriceBlock({ finalPrice, mrp }: ProductPriceBlockProps) {
  const display = getProductPriceDisplay(mrp, finalPrice);

  if (!display) {
    return null;
  }

  return (
    <View style={styles.row}>
      <Text variant="h3">{display.finalLabel}</Text>
      {display.showStrikeMrp && display.mrpLabel ? (
        <RNText style={[styles.strike, { color: colors.textSecondary }]}>
          {display.mrpLabel}
        </RNText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
});
