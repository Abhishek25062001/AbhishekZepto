import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, spacing } from '../../../theme';
import type { Cart } from '../types/cart.types';
import { formatCartGrandTotal } from '../utils/cart-price.util';
import { getCartItemCount } from '../utils/cart-display.util';

type CartSummaryFooterProps = {
  cart: Cart;
  onCheckout?: () => void;
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

export function CartSummaryFooter({ cart, onCheckout }: CartSummaryFooterProps) {
  const itemCount = getCartItemCount(cart);

  return (
    <View style={styles.footer}>
      <View style={styles.row}>
        <Text variant="small">Items ({itemCount})</Text>
        <Text variant="small">{formatCartGrandTotal(cart.subtotal)}</Text>
      </View>
      <PricingRow amount={cart.discountAmount} label="Discount" />
      <PricingRow amount={cart.taxAmount} label="Tax" />
      <PricingRow amount={cart.deliveryFeeAmount} label="Delivery fee" />
      <View style={styles.row}>
        <Text variant="h3">Total</Text>
        <Text variant="h3">{formatCartGrandTotal(cart.grandTotal)}</Text>
      </View>
      <Button
        disabled={!onCheckout}
        onPress={onCheckout ?? (() => undefined)}
        title="Proceed to checkout"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
