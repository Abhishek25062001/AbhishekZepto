import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderLineItem as OrderLineItemType } from '../types/order.types';
import { formatCartLineTotal } from '../../cart/utils/cart-price.util';

type OrderLineItemProps = {
  item: OrderLineItemType;
};

export function OrderLineItem({ item }: OrderLineItemProps) {
  const name = item.productName?.trim() || 'Product';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.name}>
          <Text variant="small">{name}</Text>
        </View>
        <Text variant="small">{formatCartLineTotal(item.lineTotal)}</Text>
      </View>
      <Text color="secondary" variant="small">
        Qty {item.quantity} × {formatCartLineTotal(item.unitPrice)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
