import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import { getRealtimeOrderStatusToastMessage } from '../utils/realtime-order-status-toast.util';

type RealtimeOrderStatusToastProps = {
  orderId?: string;
};

export function RealtimeOrderStatusToast({ orderId }: RealtimeOrderStatusToastProps) {
  const events = useRealtimeOrderStore((state) => state.realtimeOrderEvents);
  const latestEvent = [...events]
    .reverse()
    .find((event) => !orderId || event.orderId === orderId);
  const message = getRealtimeOrderStatusToastMessage(latestEvent?.orderStatus);

  if (!message) {
    return null;
  }

  return (
    <View style={styles.toast}>
      <Text variant="small">{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
