import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderListItem } from '../types/order.types';
import { formatCartGrandTotal } from '../../cart/utils/cart-price.util';
import {
  getOrderStatusLabel,
  isCancelledOrderStatus,
  isTerminalOrderStatus,
} from '../utils/order-status-label.util';

type OrderHistoryListItemProps = {
  order: OrderListItem;
  onPress: () => void;
};

const formatPlacedAt = (placedAt: string): string => {
  const date = new Date(placedAt);
  if (Number.isNaN(date.getTime())) {
    return placedAt;
  }

  return date.toLocaleString();
};

export function OrderHistoryListItem({ order, onPress }: OrderHistoryListItemProps) {
  const isCancelled = isCancelledOrderStatus(order.orderStatus);
  const isTerminal = isTerminalOrderStatus(order.orderStatus);

  return (
    <Pressable
      accessibilityLabel={`${order.orderNumber}, ${getOrderStatusLabel(order.orderStatus)}`}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.container, isTerminal ? styles.terminalContainer : null]}
    >
      <View style={styles.row}>
        <Text variant="small">{order.orderNumber}</Text>
        <Text variant="small">{formatCartGrandTotal(order.grandTotal)}</Text>
      </View>
      <Text color="secondary" variant="small">
        {formatPlacedAt(order.placedAt)} · {order.itemCount} item
        {order.itemCount === 1 ? '' : 's'}
      </Text>
      <Text color={isCancelled ? 'error' : 'secondary'} variant="small">
        {getOrderStatusLabel(order.orderStatus)}
      </Text>
    </Pressable>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  terminalContainer: {
    borderColor: colors.textSecondary,
  },
});
