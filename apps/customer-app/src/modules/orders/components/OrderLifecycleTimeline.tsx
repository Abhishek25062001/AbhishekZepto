import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderTimelineEvent } from '../types/order.types';
import {
  getCustomerTimelineEventLabel,
  getCustomerTimelineEventReason,
} from '../utils/order-lifecycle-display.util';

type OrderLifecycleTimelineProps = {
  events: OrderTimelineEvent[];
  errorMessage?: string | null;
  isLoading?: boolean;
};

const formatEventTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export function OrderLifecycleTimeline({
  errorMessage = null,
  events,
  isLoading = false,
}: OrderLifecycleTimelineProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Order timeline</Text>
      {isLoading ? (
        <Text color="secondary" variant="small">
          Loading timeline...
        </Text>
      ) : null}
      {!isLoading && errorMessage ? (
        <Text color="error" variant="small">
          {errorMessage}
        </Text>
      ) : null}
      {!isLoading && !errorMessage && events.length === 0 ? (
        <Text color="secondary" variant="small">
          Timeline updates will appear here.
        </Text>
      ) : null}
      {!isLoading && !errorMessage
        ? events.map((event) => {
            const reason = getCustomerTimelineEventReason(event);

            return (
              <View key={`${event.event}-${event.createdAt}`} style={styles.eventRow}>
                <View style={styles.dot} />
                <View style={styles.eventContent}>
                  <Text variant="small">{getCustomerTimelineEventLabel(event)}</Text>
                  <Text color="secondary" variant="caption">
                    {formatEventTime(event.createdAt)}
                  </Text>
                  {reason ? (
                    <Text color="secondary" variant="caption">
                      {reason}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })
        : null}
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
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  eventContent: {
    flex: 1,
    gap: spacing.xs,
  },
  eventRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
