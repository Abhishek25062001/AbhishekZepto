import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { formatCartGrandTotal } from '../../cart/utils/cart-price.util';

type OrderTotalsBreakdownProps = {
  subtotal: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  discountAmount: number;
  grandTotal: number;
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

export function OrderTotalsBreakdown({
  subtotal,
  taxAmount,
  deliveryFeeAmount,
  discountAmount,
  grandTotal,
}: OrderTotalsBreakdownProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="small">Subtotal</Text>
        <Text variant="small">{formatCartGrandTotal(subtotal)}</Text>
      </View>
      <PricingRow amount={discountAmount} label="Discount" />
      <PricingRow amount={taxAmount} label="Tax" />
      <PricingRow amount={deliveryFeeAmount} label="Delivery fee" />
      <View style={styles.row}>
        <Text variant="h3">Total</Text>
        <Text variant="h3">{formatCartGrandTotal(grandTotal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
