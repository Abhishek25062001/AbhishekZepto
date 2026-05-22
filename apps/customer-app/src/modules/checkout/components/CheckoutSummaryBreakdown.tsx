import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { formatCartGrandTotal } from '../../cart/utils/cart-price.util';
import type { CheckoutSummary } from '../types/checkout.types';

type CheckoutSummaryBreakdownProps = {
  summary: CheckoutSummary;
};

const PricingRow = ({ label, amount }: { label: string; amount: number }) => {
  if (amount <= 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      <Text color="secondary" variant="small">
        {label}
      </Text>
      <Text variant="small">{formatCartGrandTotal(amount)}</Text>
    </View>
  );
};

export function CheckoutSummaryBreakdown({ summary }: CheckoutSummaryBreakdownProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Order summary</Text>
      {summary.items.map((item) => (
        <View key={item.itemId} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text variant="small">{item.productName ?? 'Item'}</Text>
            <Text color="secondary" variant="small">
              Qty {item.quantity}
            </Text>
          </View>
          <Text variant="small">{formatCartGrandTotal(item.lineTotal)}</Text>
        </View>
      ))}
      <PricingRow amount={summary.discountAmount} label="Discount" />
      <PricingRow amount={summary.taxAmount} label="Tax" />
      <PricingRow amount={summary.deliveryFeeAmount} label="Delivery fee" />
      <View style={styles.row}>
        <Text variant="h3">Total</Text>
        <Text variant="h3">{formatCartGrandTotal(summary.grandTotal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
