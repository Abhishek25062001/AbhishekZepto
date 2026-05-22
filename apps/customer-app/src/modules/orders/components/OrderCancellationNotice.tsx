import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderDetail } from '../types/order.types';
import { isCancelledOrderStatus } from '../utils/order-status-label.util';

type OrderCancellationNoticeProps = {
  order: OrderDetail;
};

const formatCancelledAt = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export function OrderCancellationNotice({ order }: OrderCancellationNoticeProps) {
  if (!isCancelledOrderStatus(order.orderStatus)) {
    return null;
  }

  const cancelledAt = formatCancelledAt(order.cancelledAt);

  return (
    <View style={styles.container}>
      <Text color="error" variant="h3">
        Order cancelled
      </Text>
      {cancelledAt ? (
        <Text color="secondary" variant="small">
          Cancelled {cancelledAt}
        </Text>
      ) : null}
      {order.cancellationReason ? (
        <Text color="secondary" variant="small">
          Reason: {order.cancellationReason}
        </Text>
      ) : null}
      {order.refundReviewRequired ? (
        <Text color="secondary" variant="small">
          Refund review is required for this order.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
});
