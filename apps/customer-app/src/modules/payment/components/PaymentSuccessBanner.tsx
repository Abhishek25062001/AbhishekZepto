import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, spacing } from '../../../theme';

type PaymentSuccessBannerProps = {
  paymentId: string;
  orderId?: string | null;
  onContinueShopping?: () => void;
  onViewOrder?: () => void;
};

export function PaymentSuccessBanner({
  paymentId,
  orderId,
  onContinueShopping,
  onViewOrder,
}: PaymentSuccessBannerProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Payment successful</Text>
      <Text color="secondary" variant="small">
        Payment ID: {paymentId}
      </Text>
      {orderId ? (
        <Text color="secondary" variant="small">
          Order ID: {orderId}
        </Text>
      ) : (
        <Text color="secondary" variant="small">
          Your order will be confirmed shortly.
        </Text>
      )}
      {orderId && onViewOrder ? (
        <Button onPress={onViewOrder} title="View order" />
      ) : null}
      {onContinueShopping ? (
        <Button onPress={onContinueShopping} title="Continue shopping" variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
});
