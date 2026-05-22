import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Input, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderDetail } from '../types/order.types';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { canCustomerCancelOrderStatus } from '../utils/order-status-label.util';

type OrderCancelActionProps = {
  order: OrderDetail;
};

export function OrderCancelAction({ order }: OrderCancelActionProps) {
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { cancelOrder, errorMessage, isCancelling, isSuccess, reset } = useCancelOrder();

  if (!canCustomerCancelOrderStatus(order.orderStatus)) {
    return null;
  }

  const submit = () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setLocalError('Cancellation reason is required.');
      return;
    }

    setLocalError(null);
    void cancelOrder({ orderId: order.orderId, reason: trimmedReason });
  };

  return (
    <View style={styles.container}>
      <Text variant="h3">Cancel order</Text>
      <Input
        accessibilityLabel="Cancellation reason"
        disabled={isCancelling}
        error={localError ?? undefined}
        label="Reason"
        onChangeText={(value) => {
          reset();
          setLocalError(null);
          setReason(value);
        }}
        placeholder="Tell us why you are cancelling"
        value={reason}
      />
      {errorMessage ? (
        <Text color="error" variant="small">
          {errorMessage}
        </Text>
      ) : null}
      {isSuccess ? (
        <Text color="success" variant="small">
          Order cancellation submitted.
        </Text>
      ) : null}
      <Button
        loading={isCancelling}
        onPress={submit}
        title="Cancel order"
        variant="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
});
