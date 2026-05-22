import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CartItem } from '../types/cart.types';
import { useRemoveCartItem } from '../hooks/useRemoveCartItem';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import { formatCartLineTotal } from '../utils/cart-price.util';
import { getCustomerCartErrorMessage } from '../utils/customer-cart-error-message.util';
import { CartQuantityStepper } from './CartQuantityStepper';

type CartLineItemProps = {
  item: CartItem;
};

export function CartLineItem({ item }: CartLineItemProps) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBusy = updateMutation.isPending || removeMutation.isPending;

  const handleQuantityChange = (nextQuantity: number) => {
    setErrorMessage(null);

    if (nextQuantity < 1) {
      removeMutation.mutate(item.id, {
        onError: (error) => {
          setErrorMessage(getCustomerCartErrorMessage(error, 'Could not remove item.'));
        },
      });
      return;
    }

    updateMutation.mutate(
      { itemId: item.id, quantity: nextQuantity },
      {
        onError: (error) => {
          setErrorMessage(getCustomerCartErrorMessage(error, 'Could not update quantity.'));
        },
      },
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="small">{item.productNameSnapshot ?? 'Product'}</Text>
        <Pressable
          accessibilityLabel="Remove item"
          disabled={isBusy}
          onPress={() => handleQuantityChange(0)}
        >
          <Text color="secondary" variant="small">
            Remove
          </Text>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Text color="secondary" variant="small">
          {formatCartLineTotal(item.unitPriceSnapshot)} each
        </Text>
        <CartQuantityStepper
          disabled={isBusy}
          onDecrement={() => handleQuantityChange(item.quantity - 1)}
          onIncrement={() => handleQuantityChange(item.quantity + 1)}
          quantity={item.quantity}
        />
        <Text variant="small">{formatCartLineTotal(item.lineTotal)}</Text>
      </View>
      {errorMessage ? (
        <Text color="secondary" variant="small">
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
