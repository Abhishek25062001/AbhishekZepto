import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderDetail } from '../types/order.types';
import {
  getOrderStatusDescription,
  getOrderStatusLabel,
  isCancelledOrderStatus,
} from '../utils/order-status-label.util';

type OrderStatusSummaryProps = {
  order: OrderDetail;
};

const formatTimestamp = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getStatusTimestamp = (order: OrderDetail): string | null => {
  if (order.cancelledAt) {
    return formatTimestamp(order.cancelledAt);
  }

  if (order.readyForPickupAt) {
    return formatTimestamp(order.readyForPickupAt);
  }

  if (order.acceptedAt) {
    return formatTimestamp(order.acceptedAt);
  }

  return formatTimestamp(order.placedAt);
};

export function OrderStatusSummary({ order }: OrderStatusSummaryProps) {
  const statusTime = getStatusTimestamp(order);
  const isCancelled = isCancelledOrderStatus(order.orderStatus);

  return (
    <View style={[styles.container, isCancelled ? styles.cancelledContainer : null]}>
      <Text color={isCancelled ? 'error' : 'primary'} variant="h3">
        {getOrderStatusLabel(order.orderStatus)}
      </Text>
      <Text color="secondary" variant="small">
        {getOrderStatusDescription(order.orderStatus)}
      </Text>
      {statusTime ? (
        <Text color="secondary" variant="caption">
          Updated {statusTime}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cancelledContainer: {
    borderColor: colors.error,
  },
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
});
