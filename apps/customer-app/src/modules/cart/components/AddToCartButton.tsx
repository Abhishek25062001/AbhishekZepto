import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { useAddToCart } from '../hooks/useAddToCart';
import { getCustomerCartErrorMessage } from '../utils/customer-cart-error-message.util';

type AddToCartButtonProps = {
  compact?: boolean;
  disabled?: boolean;
  quantity?: number;
  variantId: string;
};

export function AddToCartButton({
  compact = false,
  disabled = false,
  quantity = 1,
  variantId,
}: AddToCartButtonProps) {
  const { hasStore } = useLocationContext();
  const addMutation = useAddToCart();
  const [feedback, setFeedback] = useState<string | null>(null);

  const isDisabled = disabled || !hasStore || addMutation.isPending;

  const handlePress = () => {
    setFeedback(null);
    addMutation.mutate(
      { variantId, quantity },
      {
        onSuccess: () => {
          setFeedback('Added');
          setTimeout(() => setFeedback(null), 1500);
        },
        onError: (error) => {
          setFeedback(getCustomerCartErrorMessage(error, 'Could not add to cart.'));
        },
      },
    );
  };

  return (
    <View style={compact ? styles.compact : undefined}>
      <Button
        disabled={isDisabled}
        onPress={handlePress}
        title={addMutation.isPending ? 'Adding…' : compact ? '+' : 'Add to cart'}
        variant={compact ? 'secondary' : 'primary'}
      />
      {feedback ? (
        <Text color="secondary" variant="small">
          {feedback}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  compact: {
    marginTop: spacing.xs,
  },
});
